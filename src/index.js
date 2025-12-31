/**
 * WordPress dependencies
 */
import { registerBlockType, createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	InnerBlocks,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	ToolbarButton,
	Popover,
} from '@wordpress/components';
import { link as linkIcon, linkOff } from '@wordpress/icons';
import { useState, useCallback, useRef } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';
import { displayShortcut, rawShortcut } from '@wordpress/keycodes';
import { KeyboardShortcuts } from '@wordpress/components';
import metadata from '../block.json';

/**
 * Link control component for managing URL input
 */
function LinkControlComponent( {
	isSelected,
	url,
	setAttributes,
	opensInNewTab,
	onToggleOpenInNewTab,
	anchorRef,
	queryLoopLink,
	onToggleQueryLoopLink,
} ) {
	const [ isLinkPickerOpen, setIsLinkPickerOpen ] = useState( false );

	const effectiveUrl = queryLoopLink ? undefined : url;
	const hasLink = !! effectiveUrl && isSelected;

	const openLinkPicker = useCallback( () => {
		setIsLinkPickerOpen( true );
		return false;
	}, [] );

	const closeLinkPicker = useCallback( () => {
		setIsLinkPickerOpen( false );
	}, [] );

	const unlink = useCallback( () => {
		setAttributes( {
			url: undefined,
			linkTarget: undefined,
			rel: undefined,
		} );
		setIsLinkPickerOpen( false );
	}, [ setAttributes ] );

	const linkPicker = ( isLinkPickerOpen || hasLink ) && isSelected && LinkControl && (
		<Popover
			focusOnMount={ false }
			position="bottom center"
			onClose={ closeLinkPicker }
			anchorRef={ anchorRef?.current }
		>
			<LinkControl
				className="wp-block-navigation-link__inline-link-input"
				value={ { url: effectiveUrl, opensInNewTab } }
				onChange={ ( { url: newUrl = '', opensInNewTab: newOpensInNewTab } ) => {
					setAttributes( { url: newUrl } );
					if ( opensInNewTab !== newOpensInNewTab ) {
						onToggleOpenInNewTab( newOpensInNewTab );
					}
				} }
			/>
		</Popover>
	);

	return (
		<>
			<BlockControls group="block">
				{ ! hasLink && (
					<ToolbarButton
						name="link"
						icon={ linkIcon }
						title={ __( 'Link', 'group-link' ) }
						shortcut={ displayShortcut.primary( 'k' ) }
						onClick={ openLinkPicker }
					/>
				) }
				{ hasLink && (
					<ToolbarButton
						name="link"
						icon={ linkOff }
						title={ __( 'Unlink', 'group-link' ) }
						shortcut={ displayShortcut.primaryShift( 'k' ) }
						onClick={ unlink }
						isActive={ true }
					/>
				) }
			</BlockControls>
			{ isSelected && (
				<KeyboardShortcuts
					bindGlobal
					shortcuts={ {
						[ rawShortcut.primary( 'k' ) ]: openLinkPicker,
						[ rawShortcut.primaryShift( 'k' ) ]: unlink,
					} }
				/>
			) }
			{ linkPicker }
		</>
	);
}

/**
 * Edit component
 */
function Edit( { attributes, setAttributes, isSelected, clientId, context } ) {
	const { postType, postId, queryId } = context;
	const {
		url,
		linkTarget,
		ariaLabel,
		rel,
		title,
		queryLoopLink,
		blockId,
	} = attributes;

	const [ entityLink ] = useEntityProp( 'postType', postType, 'link', postId );

	const anchorRef = useRef();

	const blockProps = useBlockProps( { ref: anchorRef } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		renderAppender: false,
	} );

	const handleToggleOpenInNewTab = useCallback(
		( newOpensInNewTab ) => {
			const newLinkTarget = newOpensInNewTab ? '_blank' : undefined;
			let newRel = rel;

			if ( newLinkTarget && ! rel ) {
				newRel = 'noreferrer noopener';
			} else if ( ! newLinkTarget && rel === 'noreferrer noopener' ) {
				newRel = undefined;
			}

			setAttributes( {
				linkTarget: newLinkTarget,
				rel: newRel,
			} );
		},
		[ rel, setAttributes ]
	);

	const opensInNewTab = linkTarget === '_blank';

	return (
		<>
			<LinkControlComponent
				url={ url }
				setAttributes={ setAttributes }
				isSelected={ isSelected }
				opensInNewTab={ opensInNewTab }
				onToggleOpenInNewTab={ handleToggleOpenInNewTab }
				anchorRef={ anchorRef }
				queryLoopLink={ queryLoopLink }
				onToggleQueryLoopLink={ ( value ) =>
					setAttributes( { queryLoopLink: value } )
				}
			/>
			<InspectorControls>
				<PanelBody title={ __( 'Link settings', 'group-link' ) }>
					<ToggleControl
						label={ __( 'Use link from Query Loop Block', 'group-link' ) }
						help={ __(
							'Link to the current post when using inside a Query Loop Block.',
							'group-link'
						) }
						checked={ queryLoopLink }
						onChange={ ( value ) => setAttributes( { queryLoopLink: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label={ __( 'Link rel', 'group-link' ) }
					value={ rel || '' }
					onChange={ ( value ) => setAttributes( { rel: value } ) }
				/>
				<TextControl
					label={ __( 'Aria-Label', 'group-link' ) }
					value={ ariaLabel || '' }
					onChange={ ( value ) => setAttributes( { ariaLabel: value } ) }
				/>
				<TextControl
					label={ __( 'Link title', 'group-link' ) }
					value={ title || '' }
					onChange={ ( value ) => setAttributes( { title: value } ) }
				/>
				<TextControl
					label={ __( 'HTML Anchor', 'group-link' ) }
					help={ __(
						'Enter a word or two — without spaces — to make a unique web address.',
						'group-link'
					) }
					value={ blockId || '' }
					onChange={ ( value ) => setAttributes( { blockId: value } ) }
					placeholder={ __( 'e.g., my-custom-id', 'group-link' ) }
				/>
			</InspectorAdvancedControls>
			<div { ...innerBlocksProps } />
		</>
	);
}

/**
 * Save component
 */
function save( { attributes, className } ) {
	const { url, linkTarget, rel, title, queryLoopLink, blockId, ariaLabel } = attributes;
	const blockProps = useBlockProps.save( {
		className,
		id: blockId || undefined,
	} );

	const hasUrl = !! url || queryLoopLink;
	const Tag = hasUrl ? 'a' : 'div';

	const anchorAttrs = hasUrl
		? {
				href: queryLoopLink ? undefined : url,
				target: linkTarget || undefined,
				rel: rel || undefined,
				title: title || undefined,
				'aria-label': ariaLabel || undefined,
		  }
		: {};

	return (
		<Tag { ...blockProps } { ...anchorAttrs }>
			<InnerBlocks.Content />
		</Tag>
	);
}

/**
 * Block registration
 */
registerBlockType( metadata.name, {
	...metadata,
	icon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
		>
			<path d="M10 17.389H8.444A5.194 5.194 0 1 1 8.444 7H10v1.5H8.444a3.694 3.694 0 0 0 0 7.389H10v1.5ZM14 7h1.556a5.194 5.194 0 0 1 0 10.39H14v-1.5h1.556a3.694 3.694 0 0 0 0-7.39H14V7Zm-4.5 6h5v-1.5h-5V13Z" />
		</svg>
	),
	description: __(
		'Combine blocks into a group wrapped with a hyperlink or div element.',
		'group-link'
	),
	keywords: [
		__( 'container', 'group-link' ),
		__( 'wrapper', 'group-link' ),
		__( 'anchor', 'group-link' ),
		__( 'hyperlink', 'group-link' ),
		__( 'link', 'group-link' ),
	],
	example: {
		attributes: {},
		innerBlocks: [
			{
				name: 'core/paragraph',
				attributes: {
					content: __( 'One.', 'group-link' ),
				},
			},
			{
				name: 'core/paragraph',
				attributes: {
					content: __( 'Two.', 'group-link' ),
				},
			},
			{
				name: 'core/paragraph',
				attributes: {
					content: __( 'Three.', 'group-link' ),
				},
			},
		],
	},
	transforms: {
		from: [
			{
				type: 'block',
				isMultiBlock: true,
				blocks: [ '*' ],
				__experimentalConvert( blocks ) {
					// Don't transform if it's already this block
					if (
						blocks.length === 1 &&
						blocks[ 0 ].name === metadata.name
					) {
						return;
					}

					const innerBlocks = blocks.map( ( block ) =>
						createBlock(
							block.name,
							block.attributes,
							block.innerBlocks
						)
					);

					return createBlock( metadata.name, {}, innerBlocks );
				},
			},
		],
	},
	edit: Edit,
	save,
} );
