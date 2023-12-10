import MessagePortRequester from "../scripts/MessagePortRequester"



const messagePorts = {}
const messagePortRequester = new MessagePortRequester({ 
    getPortMethod: () => getMainTab(), 
    postMessageMethod: postMessage
})
let idCounter = 0

self.onconnect = function (e) {
    const messagePort = e.source
    const tabId = idCounter++
    messagePort.id = tabId
    messagePorts[tabId] = messagePort

    messagePort.addEventListener('message', handleMessage)

    postMessage({
        messagePort, 
        header: 'init', 
        message: {
            id: tabId,
            tabType: getTabType(messagePort)
        }
    })

    messagePort.start()
}



async function handleMessage(e) {
    const data = e.data
    const portId = data.id
    const sender = e.currentTarget
    console.log(e)

    const header = data.header
    const message = data.message
    if (!header) return

    if (header === 'coinsDataRequest') {
        postMessage({
            messagePort: getMessagePort(portId),
            header: 'coinsData',
            message: {coinsData: await getCoinsData()}
        })
    }

    if (header === 'changeTickerPrice') {
        postToSecondaryTabs({ header, message })
    }

    if (header === 'addTicker') {
        postToOtherTabs({ 
            messagePort: sender,
            header,
            message
        })
    }

    if (header === 'removeTicker') {
        postToOtherTabs({ 
            messagePort: sender,
            header,
            message
        })
    }

    if (header === 'unload') {
        deleteTab(portId)
    }
}

function deleteTab(tabId) {
    let isMainTabChanged = false
    
    if (messagePorts[tabId] === Object.values(messagePorts)[0]) {
        isMainTabChanged = true
    }

    delete messagePorts[tabId]

    if (isMainTabChanged && getMainTab()) {
        postMessage({
            messagePort: getMainTab(),
            header: 'typeChanged',
            message: { tabType: 'main' }
        })
    } 
}



function getMainTab() {
    return Object.values(messagePorts)[0]
}

function getSecondaryTabs() {
    return Object.values(messagePorts).slice(1)
}

function getOtherTabs(tab) {
    return Object.values(messagePorts).filter(port => port != tab)
}

function getTabType(target) {
    return getMainTab().id === target.id
        ? 'main'
        : 'secondary'
}

function getMessagePort(id) {
    return messagePorts[id]
}



async function getCoinsData() {
    return await messagePortRequester.requestData({ 
        requestHeader: 'coinsDataRequest', 
        responceHeader: 'coinsData'
    })
}

function postMessage({messagePort, header, message}) {
    messagePort.postMessage({
        header,
        message
    })
}

function postToSecondaryTabs({header, message}) {
    getSecondaryTabs().forEach(messagePort => 
        postMessage({
            messagePort,
            header,
            message 
        })
    )
}

function postToOtherTabs({ messagePort, header, message }) {
    getOtherTabs(messagePort).forEach(messagePort => 
        postMessage({
            messagePort,
            header,
            message
        })
    )
}
