<?php
/**
 * Plugin Name:     Group Link Block
 * Plugin URI:      https://github.com/baden03/wp-group-link-block
 * Description:     Combine blocks into a group wrapped with a hyperlink (&lt;a&gt;) or div element.
 * Version:         1.0.0
 * Author:          Twinpictures
 * Author URI:      https://twinpictures.com
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     group-link
 *
 * @package         twinpictures
 */

namespace Twinpictures\GroupLinkBlock;

/**
 * Renders the block on the server.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 * @return string Returns the block markup.
 */
function render_block_core( $attributes, $content, $block ) {
	// Get ID attribute
	$block_id = ! empty( $attributes['blockId'] ) ? esc_attr( $attributes['blockId'] ) : '';

	// Get URL
	$url = isset( $attributes['url'] ) && $attributes['url'] ? $attributes['url'] : '';
	if ( ! empty( $attributes['blockId'] ) ) {
		$url = apply_filters( 'avf_column_link', $url, $attributes['blockId'] );
	}

	// Query Loop link support
	$post_url = ! empty( $attributes['queryLoopLink'] ) ? get_the_permalink( get_the_ID() ) : esc_url( $url );
	$href     = $post_url !== '' ? 'href="' . $post_url . '"' : '';

	// Render inner blocks
	$inner_blocks_html = '';
	foreach ( $block->inner_blocks as $inner_block ) {
		$inner_blocks_html .= $inner_block->render();
	}

	// Determine wrapper tag: <a> if URL exists or Query Loop link is enabled, <div> if no URL
	$has_url = ! empty( $url ) || ! empty( $attributes['queryLoopLink'] );
	$tag     = $has_url ? 'a' : 'div';

	// Build wrapper attributes - get_block_wrapper_attributes handles classes automatically
	$wrapper_attrs = array();
	
	// Add ID if provided
	if ( $block_id ) {
		$wrapper_attrs['id'] = $block_id;
	}
	
	// Add deactivated class for div without URL
	// get_block_wrapper_attributes will merge this with default WordPress classes
	if ( $tag === 'div' && ! $has_url ) {
		$wrapper_attrs['class'] = 'deactivated';
	}

	// Add anchor-specific attributes if it's an anchor tag
	if ( $tag === 'a' ) {
		if ( $post_url !== '' ) {
			$wrapper_attrs['href'] = $post_url;
		}
		if ( ! empty( $attributes['linkTarget'] ) ) {
			$wrapper_attrs['target'] = $attributes['linkTarget'];
		}
		if ( ! empty( $attributes['rel'] ) ) {
			$wrapper_attrs['rel'] = $attributes['rel'];
		}
		if ( ! empty( $attributes['ariaLabel'] ) ) {
			$wrapper_attrs['aria-label'] = $attributes['ariaLabel'];
		}
		if ( ! empty( $attributes['title'] ) ) {
			$wrapper_attrs['title'] = $attributes['title'];
		}
	}

	// get_block_wrapper_attributes merges our attributes with WordPress default classes and custom classes
	// Pass $block as second parameter so it can access custom classes from the editor
	$wrapper_attributes = get_block_wrapper_attributes( $wrapper_attrs, $block );

	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		$tag,
		$wrapper_attributes,
		$inner_blocks_html
	);
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function create_group_link_block_init() {
	register_block_type_from_metadata(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\render_block_core',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\create_group_link_block_init' );

/**
 * Strip inner anchor elements to prevent nested anchors.
 *
 * @param string $block_content The block content about to be appended.
 * @param array  $block         The full block, including name and attributes.
 * @return string Returns the modified block content.
 */
function strip_inner_anchors( $block_content = '', $block = array() ) {
	if ( isset( $block['blockName'] ) && 'twinpictures/group-link' === $block['blockName'] ) {
		// Recursive function to strip anchors from inner blocks
		$strip_anchors = function( $inner_blocks ) use ( &$strip_anchors, &$block_content ) {
			foreach ( $inner_blocks as $inner_block ) {
				if ( isset( $inner_block['innerHTML'] ) && str_contains( $inner_block['innerHTML'], '<a' ) ) {
					$original_html = $inner_block['innerHTML'];
					$modified_html = str_replace( '<a', '<span', $original_html );
					$modified_html = str_replace( '</a>', '</span>', $modified_html );

					// Replace in block content
					$block_content = str_replace(
						trim( $original_html ),
						$modified_html,
						$block_content
					);
				}

				// Recursively process nested inner blocks
				if ( ! empty( $inner_block['innerBlocks'] ) ) {
					$strip_anchors( $inner_block['innerBlocks'] );
				}
			}
		};

		if ( ! empty( $block['innerBlocks'] ) ) {
			$strip_anchors( $block['innerBlocks'] );
		}

		return $block_content;
	}

	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\strip_inner_anchors', 10, 2 );
