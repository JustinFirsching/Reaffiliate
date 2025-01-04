/**
 * Shows a popup with a message for a certain amount of time
 * @param {string} message - The message to display
 * @param {number} display_seconds - The amount of time to display the message for
 * @returns {void}
 * @example showPopup('Hello World!', 5)
 */
function showPopup(message, display_seconds) {
    console.debug(
        `Displaying popup for ${display_seconds} seconds stating: ${message}`
    )
    const popup = document.createElement('div')
    popup.className = 'popup-warning'
    popup.innerText = message
    popup.addEventListener('transitionend', () => {
        document.body.removeChild(popup)
    })

    document.body.appendChild(popup)

    const timeout = setTimeout(() => {
        popup.classList.add('fade-out')
    }, display_seconds * 1000)

    popup.addEventListener('click', () => {
        clearTimeout(timeout)
        popup.classList.add('fade-out')
    })
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.type === 'reaffiliate-showPopup') {
        if (message.message) {
            showPopup(`[Reaffiliate] ${message.message}`, +message.display_seconds ?? 5)
        } else {
            sendResponse({ error: 'No message provided' })
        }
    }
})
