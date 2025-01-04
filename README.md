# Reaffiliate

**Reaffiliate** is a browser extension designed to monitor and protect your
affiliate cookies from being overwritten. It ensures that changes to your
affiliate codes are reverted to their original values, helping you retain your
rightful commissions.

## Features

- **Monitor Cookies:** Detects when affiliate cookies are changed.
- **Restore Original Cookies:** Automatically reverts changes to affiliate
  cookies when necessary.
- **Popup Notifications:** Displays warnings when changes to affiliate cookies
  reverted.
- **Supports All Domains:** Works across all websites that store affiliate
  codes in cookies under a name containing `affiliate` to protect your
  affiliate codes.

## Dev Installation

1. Clone or download this repository to your local machine.
2. Open your browser and navigate to the extensions management page:
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
3. Enable "Developer Mode."
4. Click "Load unpacked" and select the directory where this extension is
   stored.
5. The extension will now appear in your browser's extension list.

## Usage

1. Once installed, Reaffiliate will automatically run in the background.
2. Whenever an affiliate cookie is modified, the extension:
   - Checks if the new value matches the stored value.
   - Reverts the cookie to its original value if it was changed.
   - Displays a popup notification indicating the change and reversion.

## Files and Structure

### `manifest.json`

Defines the extension's metadata and permissions:

- **Permissions:** Includes cookies, storage, and access to all URLs.
- **Background Script:** Runs the core logic (`background.js`) as a service
  worker.
- **Content Script:** Injected into pages to display popup notifications.

### `background.js`

Handles:

- Monitoring cookie changes via `chrome.cookies.onChanged`.
- Storing and retrieving cookie values using `chrome.storage.local`.
- Reverting affiliate cookies when changes are detected.
- Sending messages to the content script to trigger popup notifications.

### `content.js`

Handles:

- Receiving messages from `background.js`.
- Displaying popup notifications when affiliate changes are detected.

### `styles.css`

Defines the appearance of popup notifications:

- Positioned at the top-right of the viewport.
- Automatically fades away after a set time or on click.

---

## How It Works

1. **Detecting Cookie Changes**:

   - `chrome.cookies.onChanged` listens for updates to cookies.
   - If the cookie name includes "affiliate", it is processed.

2. **Storing Original Cookies**:

   - The extension stores the original cookie value in `chrome.storage.local`
     when first detected.

3. **Reverting Changes**:

   - If a subsequent cookie update modifies the value, the extension restores
     the original value.

4. **Popup Notifications**:

   - A message is sent from `background.js` to `content.js` to display a
     notification about the change.

---

## Permissions

The extension requires the following permissions:

- **`cookies`**: To monitor and modify cookie values.
- **`storage`**: To save the original affiliate cookie values.
- **`<all_urls>`**: To operate across all domains.

---

## Example Scenarios

- **Affiliate Link Change**:
  - If a user clicks an affiliate link, the extension ensures their original
    affiliate code remains intact.
- **Conflict Detection**:
  - When competing affiliate links are detected, the extension reverts the
    cookie to the stored value and alerts the user.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more
details.
