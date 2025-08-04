# ToDoBro Chrome Extension

A sophisticated and efficient to-do list Chrome extension that helps you stay organized and productive with international support and advanced features.

## Supported Languages

The extension supports the following languages:

- 🇺🇸 English (en)
- 🇩🇰 Danish (da)
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇫🇮 Finnish (fi)
- 🇫🇷 French (fr)
- 🇮🇹 Italian (it)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇳🇴 Norwegian Bokmål (nb)
- 🇳🇱 Dutch (nl)
- 🇳🇴 Norwegian (no)
- 🇵🇱 Polish (pl)
- 🇧🇷 Portuguese Brazil (pt_BR)
- 🇵🇹 Portuguese Portugal (pt_PT)
- 🇷🇺 Russian (ru)
- 🇸🇪 Swedish (sv)
- 🇹🇷 Turkish (tr)
- �🇦 Ukrainian (uk)
- �🇨🇳 Chinese Simplified (zh_CN)
- 🇹🇼 Chinese Traditional (zh_TW)

## Usage

1. Click the ToDoBro extension icon in your Chrome toolbar
2. Type your task in the input field and click "Add" or press Enter
3. Click the checkbox to mark tasks as complete
4. Click the "×" button to delete tasks
5. View your progress with the stats at the bottom

### Context Menu Feature

- Select any text on a webpage
- Right-click and choose "Add to ToDoBro"
- The selected text will be added as a new todo item

## Development

The extension uses:

- **Manifest V3** (latest Chrome extension standard)
- **Chrome Storage API** for data persistence
- **Chrome Notifications API** for feedback
- **Chrome Context Menus API** for right-click integration
- **Chrome i18n API** for internationalization
- **React v18+** for development

## Permissions

The extension requires these permissions:

- `storage` - To save your todos locally
- `activeTab` - For context menu functionality
- `contextMenus` - To add right-click menu options
- `notifications` - To show feedback messages

## Privacy

All your todo data is stored locally in your browser. No data is sent to external servers.

## Contributing

Feel free to submit issues and enhancement requests! When adding new features, please ensure they support internationalization.

## License

See the LICENSE file for details.
