import { getWorker } from './tabsSyncWorkerApi'

let addTickerMethod
let removeTickerMethod

export const subscribeToAddTickers = (cb) => {
	addTickerMethod = cb
}

export const subscribeToRemoveTickers = (cb) => {
	removeTickerMethod = cb
}

const tabsSyncWorker = getWorker()
tabsSyncWorker.port.addEventListener('message', handleMessage)

function handleMessage(e) {
	const header = e.data.header
	const message = e.data.message
	if (!header) return

	if (header === 'addTicker') {
		addTickerMethod?.(message.tickerName, true)
	}

	if (header === 'removeTicker') {
		removeTickerMethod?.(message.tickerName, true)
	}
}
