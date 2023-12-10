import callAfterPromise from "../scripts/callAfterPromise"
import TabsTypesFactory from "../scripts/tabsTypes/TabsTypesFactory"
import { getTabType, getWorker, postMessage } from "./tabsSyncWorkerApi"

const API_KEY = '5f9886c3c60cd3cea843b575c53f4fe48370405c6ba03ce2bb59fce9fd465064'
const tickersHandlers = new Map()


let tab
let tabDefineResolve
const tabDefinePromise = new Promise((resolve) => {tabDefineResolve = resolve})

const tabInit = (async () => {
    const tabType = await getTabType()
    const worker = getWorker()

    const tabFactory = new TabsTypesFactory(tabType)
    tab = tabFactory.createTab(tabType, {apiKey: API_KEY, tickersHandlers, tabsSyncWorker: worker})
    tabDefineResolve()
})

tabInit()



const callAfterInit = callAfterPromise(tabDefinePromise)

export const getCoinsData = callAfterInit(
    async () => await tab.getCoinsData()
)

export const subscribeToTicker = callAfterInit(
    async (tickerName, cb, doNotShare) => {
        tab.subscribeToTicker(tickerName, cb)
        
        if (!doNotShare) {
            postMessage({ header: 'addTicker', message: { tickerName }})
        }
    }
)

export const unsubscribeToTicker = callAfterInit(
    async (tickerName, doNotShare) => {
        tab.unsubscribeToTicker(tickerName, doNotShare)

        if (!doNotShare) {
            postMessage({ header: 'removeTicker', message: { tickerName }})
        }
    }
)
