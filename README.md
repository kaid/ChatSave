# Chat Save

Chat Save is a Chrome extension that adds an export button to ChatGPT
conversation pages and saves the current conversation as Markdown.

It reads the conversation through ChatGPT's same-origin conversation endpoint,
`/backend-api/conversation/<conversation_id>`, instead of scraping rendered DOM
nodes. This avoids missing messages when ChatGPT uses virtual scrolling.

## Features

- Adds an export button to the ChatGPT conversation header.
- Fetches the full conversation from the backend conversation API.
- Reads the access token from ChatGPT bootstrap data when available.
- Streams the response and writes Markdown through `showSaveFilePicker()` when
  the browser supports it.
- Includes attachment names and basic attachment metadata from message metadata.
- Localizes UI labels and Markdown metadata from the browser language.
- Built-in locale support: English, French, Spanish, Portuguese, Simplified
  Chinese, and Traditional Chinese.

## Project Structure

- `src/manifest.json`: Chrome Manifest V3 configuration.
- `src/content.js`: content script for button placement, API fetching, Markdown
  conversion, and file saving.
- `src/icons/`: generated PNG extension icons.
- `scripts/generate_icons.ts`: generates the PNG icons used by the manifest.
- `scripts/build.ts`: builds the unpacked extension into `dist/chat-save/`.
- `scripts/pack.ts`: creates a distributable zip package.
- `dist/`: generated build output.

## Development Install

1. Run:

   ```sh
   deno task build
   ```

2. Open `chrome://extensions/`.
3. Enable Developer mode.
4. Click "Load unpacked".
5. Select `dist/chat-save/`.

After editing source files, run `deno task build` again, reload the extension on
the extensions page, then refresh the ChatGPT tab.

## Packaging

```sh
deno task pack
```

This builds `dist/chat-save/` and creates a versioned package such as:

```text
dist/chat-save-v1.0.4.zip
```

Use the zip file for manual distribution or Chrome Web Store upload.

## Privacy

See [PRIVACY.md](./PRIVACY.md).

## Commands

```sh
deno task fmt
deno task check
deno task icons
deno task build
deno task pack
deno task verify
```

`deno task pack` requires the system `zip` command. It is available by default
on macOS.

## Notes

- Chat Save only works on `chatgpt.com` and `chat.openai.com` pages covered by
  the extension manifest.
- The extension depends on ChatGPT's private web conversation endpoint, so it
  may need maintenance if the site changes that API or bootstrap data shape.
- The extension does not read from the visible conversation DOM as a fallback.
