=== Group Link Block ===
Contributors:      twinpictures
Tags:              block, hyperlink, link, gutenberg, anchor, group
Requires at least: 6.6
Tested up to:      6.9
Stable tag:        1.0.0
Requires PHP:      7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Combine blocks into a group wrapped with a hyperlink (&lt;a&gt;) or div element.

== Description ==

Combine blocks into a group wrapped with a hyperlink (&lt;a&gt;) or div element.
After inserting a Group Link Block, a Block inserter icon will be displayed to allow you to add new Blocks inside that Group Link Block.

The block automatically wraps inner blocks in an anchor element when a URL is provided, or a div element when no URL is provided.

= Grouping Existing Blocks =
It's also possible to group existing Blocks. 
Select the Blocks which should be grouped with a Link. The Block Toolbar will appear. Click on the Block icon and select the Group Link Block to transform the selected Blocks to a Group Link Block with some InnerBlocks.

= Advanced =
On the Advanced Tab set the link's [rel](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel), [title](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title) and [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) attributes.

You can also set a unique HTML ID attribute for the wrapping element, which is useful for anchor linking or JavaScript targeting.

= Features =
* Wrap Blocks with a hyperlink (when URL is provided)
* Wrap Blocks with a div (when no URL is provided)
* Use link from Query Loop Block
* Transform Blocks into a group wrapped with an HTML anchor tag (&lt;a&gt;) or div
* Set the link href attribute
* Set rel, title and aria-label attributes
* Option to open link in a new window
* Set unique ID attribute for the wrapping element
* Inner anchor elements are automatically stripped to prevent nested anchors

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/group-link-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Run `npm install` in the plugin directory
4. Run `npm run build` to build the block assets

== Frequently Asked Questions ==

= Can I use links within the Group Link Block? =

No, that is illegal and causes errors in the rendered HTML. The plugin automatically strips anchor elements from inner blocks to prevent nested anchors.

= How does the block decide between &lt;a&gt; and &lt;div&gt;? =

The block automatically wraps inner blocks in an anchor element (&lt;a&gt;) when a URL is provided. When no URL is provided, it wraps in a div element with a "deactivated" class.

= What is the difference from other similar blocks? =

This block removes WordPress's built-in `anchor: true` support to prevent duplicate anchor elements. The block has full control over when to use &lt;a&gt; vs &lt;div&gt; wrappers.

== Screenshots ==

1. Group Link Block to group Blocks with a link.
2. Wrap Blocks with a link.
3. Rendered HTML with anchor element.
4. Advanced Settings for rel, title, aria-label, and ID attributes.

== Changelog ==

= 1.0.0 - Initial Release =
* Initial release
* Wrap blocks in anchor or div element based on URL presence
* Support for Query Loop links
* Unique ID attribute support
* Link attributes (rel, title, aria-label, target)
* Automatic anchor stripping from inner blocks
* Block transforms support
