function buildSetableCookie(cookie) {
    const protocol = cookie.secure ? 'https' : 'http'
    const cookieObjKeys = [
        'domain',
        'expirationDate',
        'httpOnly',
        'name',
        'partitionKey',
        'path',
        'sameSite',
        'secure',
        'storeId',
        'url',
        'value',
    ]

    const setableCookie = cookieObjKeys.reduce((filtered, key) => {
        if (key in cookie) {
            filtered[key] = cookie[key]
        }
        return filtered
    }, {})
    setableCookie.url = `${protocol}://${cookie.domain}`

    console.debug('Built setable cookie: ', cookie, setableCookie)
    return setableCookie
}

function buildDeletableCookie(cookie) {
    const deletableCookie = {
        name: cookie.name,
        url: cookie.url,
    }

    if (cookie.partitionKey !== undefined) {
        deletableCookie.partitionKey = cookie.partitionKey
    }

    if (cookie.storeId !== undefined) {
        deletableCookie.storeId = cookie.storeId
    }

    console.debug('Built deletable cookie: ', cookie, deletableCookie)
    return deletableCookie
}

function storeCookieLocally(key, setableCookie) {
    console.debug('Storing cookie...', key, setableCookie)
    chrome.storage.local.set({ [key]: setableCookie }, function () {
        if (chrome.runtime.lastError) {
            console.error(
                'Failed to store cookie!',
                chrome.runtime.lastError,
                setableCookie
            )
        } else {
            console.debug('Successfully stored cookie!', setableCookie)
        }
    })
}

function setCookie(setableCookie) {
    console.debug('Attempting to set cookie', setableCookie)
    chrome.cookies.set(setableCookie, function (cookie) {
        if(chrome.runtime.lastError) {
            console.error(
                'Failed to set cookie!',
                chrome.runtime.lastError,
                cookie
            )
        } else {
            console.debug('Successfully set cookie', setableCookie)
        }
    })
}

function deleteCookie(deletableCookie) {
    console.debug('Attempting to remove cookie', deletableCookie)
    chrome.cookies.remove(deletableCookie, function (cookie) {
        if (chrome.runtime.lastError) {
            console.error(
                'Failed to remove old cookie!',
                chrome.runtime.lastError,
                deletableCookie
            )
        } else {
            console.debug('Successfully removed cookie!', cookie)
        }
    })
}

function overwriteNewAffiliate(newSetableCookie, oldSetableCookie) {
    const deletableCookie = buildDeletableCookie(newSetableCookie)
    deleteCookie(deletableCookie)
    setCookie(oldSetableCookie)
}

chrome.cookies.onChanged.addListener((changeInfo) => {
    if (changeInfo.cause != 'explicit' && changeInfo.cause != 'overwrite') {
        return
    }

    const newCookie = changeInfo.cookie
    if(newCookie.domain.startsWith(".")){
        newCookie.domain = newCookie.domain.slice(1)
    }

    const { domain, name } = newCookie

    if (name.toLowerCase().includes('affiliate')) {
        console.warn(domain)
        const key = `${domain}--${name}`
        const setableNewCookie = buildSetableCookie(newCookie)
        console.debug(
            'Received an updated cookie',
            setableNewCookie,
            changeInfo
        )

        chrome.storage.local.get([key], function (result) {
            const storedCookie = result[key]
            if (
                storedCookie === undefined ||
                storedCookie.expirationDate < Date.now() / 1000
            ) {
                // Not set or expired
                console.debug(
                    `${key} not previously tracked or expired. Updating record.`,
                    setableNewCookie,
                    changeInfo
                )
                storeCookieLocally(key, setableNewCookie)
            } else {
                // Set and not expired
                if (newCookie.value != storedCookie.value) {
                    // We changed affiliates!
                    console.warn(
                        'Affiliate changed! Changing back...',
                        storedCookie
                    )
                    overwriteNewAffiliate(setableNewCookie, storedCookie)
                } else {
                    // Nothing to do...
                    console.debug('Affiliate not changed.')
                }
            }
        })
    }
})
