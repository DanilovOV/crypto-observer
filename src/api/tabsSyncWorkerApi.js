import callAfterPromise from "../scripts/callAfterPromise";
import MessagePortRequester from "../scripts/MessagePortRequester";



let tabId
let tabType
const tabsSyncWorker = new SharedWorker(new URL('../workers/tabsSyncWorker', import.meta.url), {type: 'module'});

let tabInitResolve
let tabInitPromise = new Promise((resolve) => {tabInitResolve = resolve})

const messagePortRequester = new MessagePortRequester({ 
    getPortMethod: () => tabsSyncWorker.port, 
    postMessageMethod: postMessage
})

tabsSyncWorker.port.onmessage = handleWorkerMessage

async function handleWorkerMessage(e) {
    const header = e.data.header
    const message = e.data.message
    if (!header) return

    if (header === 'init') {
        tabId = message.id
        tabType = message.tabType
        tabInitResolve()
    }

    console.log("Воркер прислал:", e.data)
}


window.addEventListener('unload', () => {
    postMessage({header: 'unload'})
})



const callAfterInit = callAfterPromise(tabInitPromise)

export function getWorker() {
    return tabsSyncWorker
}

export const getTabType = callAfterInit(
    () => tabType
)

export function postMessage({header, message}) {
    callAfterInit(
        async ({header, message}) => {
            tabsSyncWorker.port.postMessage({
                header,
                message,
                id: tabId
            })
        }
    )({header, message})
}

export const requestWorkerData = callAfterInit(
    async ({ requestHeader, responceHeader }) => {
        postMessage({ header: requestHeader })
        return await waitWorkerData({ responceHeader })
    }
) 

export const waitWorkerData = callAfterInit(
    async ({ responceHeader }) => {
        let result
        let resultReceived
        const resultPromise = new Promise(resolve => resultReceived = resolve)
    
        tabsSyncWorker.port.addEventListener('message', getMessage)
    
        function getMessage(e) {
            const data = e.data
            if (!data) return
            const header = data.header
            if (!header) return
    
            if (header === responceHeader) {
                result = data.message.coinsData
                resultReceived()
            }
        }
        
        await resultPromise
        tabsSyncWorker.port.removeEventListener('message', getMessage)
    
        return result
    }
)
