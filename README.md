# Group Link Block

A WordPress block plugin that allows you to combine multiple blocks into a group wrapped with a hyperlink (`<a>`) or div element.

## Description

Group Link Block lets you wrap any combination of blocks with a link, making entire block groups clickable. Perfect for creating card layouts, linked sections, and interactive content areas. The block automatically handles the HTML structure, wrapping inner blocks in an anchor element when a URL is provided, or a div element when no URL is set.

## Features

- Wrap multiple blocks with a hyperlink (when URL is provided)
- Wrap blocks with a div element (when no URL is provided)
- Use link from Query Loop Block for dynamic post links
- Transform existing blocks into a linked group
- Set link target (open in new window/tab)
- Set rel, title, and aria-label attributes for accessibility
- Set unique HTML ID attribute for anchor linking or JavaScript targeting
- Automatic anchor stripping from inner blocks to prevent nested anchors (invalid HTML)
- Full block editor support with keyboard shortcuts (Cmd/Ctrl+K to add link)
- Supports spacing controls (margin, padding)
- Supports alignment options

## Installation

### From GitHub

1. Download or clone this repository
2. Upload the plugin files to `/wp-content/plugins/group-link-block/` directory, or install through the WordPress plugins screen
3. Activate the plugin through the 'Plugins' screen in WordPress
4. Run `npm install` in the plugin directory
5. Run `npm run build` to build the block assets

### Requirements

- WordPress 6.6 or higher
- PHP 7.4 or higher
- Node.js and npm (for building assets)

## Usage

### Adding a Group Link Block

1. Click the Block Inserter (+) icon in the editor
2. Search for "Group Link" or find it in the Design category
3. Click to insert the block
4. Add blocks inside the Group Link Block using the Block Inserter icon
5. Click the link icon in the block toolbar (or press Cmd/Ctrl+K) to add a URL

### Grouping Existing Blocks

1. Select the blocks you want to group
2. Click the block icon in the toolbar
3. Select "Group Link Block" to transform the selected blocks

### Query Loop Integration

When using the block inside a Query Loop Block:
- Enable "Use link from Query Loop Block" in the Link settings panel
- The block will automatically link to the current post in the loop

### Advanced Settings

In the Block Settings sidebar:
- **Link rel**: Set the rel attribute (e.g., `nofollow`, `noopener`)
- **Aria-Label**: Add an accessible label for screen readers
- **Link title**: Set a title attribute for the link
- **HTML Anchor**: Set a unique ID for anchor linking or JavaScript targeting

## Development

### Building the Plugin

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start development mode with hot reloading
npm start

# Format JavaScript code
npm run format:js

# Lint JavaScript
npm run lint:js

# Lint CSS
npm run lint:css
```

### Project Structure

```
wp-group-link-block/
├── src/              # Source files
│   ├── index.js      # Block editor JavaScript
│   └── style.scss    # Block styles
├── build/            # Built assets (generated)
├── block.json        # Block metadata
├── group-link-block.php  # Main plugin file
└── package.json      # Node dependencies
```

## Technical Details

- The block uses WordPress's `block.json` metadata format
- Server-side rendering handles dynamic link generation
- Inner anchor elements are automatically stripped to prevent nested anchors (which is invalid HTML)
- The block uses `get_block_wrapper_attributes()` for proper class merging
- Supports WordPress block transforms for converting existing blocks

## FAQ

### Can I use links within the Group Link Block?

No. Nested anchor elements are invalid HTML and cause rendering issues. The plugin automatically strips anchor elements from inner blocks to prevent this.

### How does the block decide between `<a>` and `<div>`?

The block automatically wraps inner blocks in an anchor element (`<a>`) when a URL is provided or when Query Loop link is enabled. When no URL is provided, it wraps in a div element with a "deactivated" class.

### What's different from WordPress's built-in Group block with links?

This block provides full control over link attributes (rel, title, aria-label, target) and automatically handles the HTML structure without relying on WordPress's built-in anchor support, which can cause duplicate anchor elements.

## License

GPL-2.0-or-later

## Author

**Twinpictures**

- Website: [twinpictures.com](https://twinpictures.com)
- GitHub: [@baden03](https://github.com/baden03/)

## Changelog

### 1.0.0 - Initial Release

* Initial release
* Wrap blocks in anchor or div element based on URL presence
* Support for Query Loop links
* Unique ID attribute support
* Link attributes (rel, title, aria-label, target)
* Automatic anchor stripping from inner blocks
* Block transforms support
