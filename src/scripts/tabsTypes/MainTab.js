import WsTickersUpdater from '../tickersUpdater/WsTickersUpdater'
// import FetchTickersUpdater from '../tickersUpdater/FetchTickersUpdater'
import getCoinsData from '../getCoinsData'
import { postMessage } from '../../api/tabsSyncWorkerApi'

export default class MainTab {
	constructor({ apiKey, tickersHandlers, tabsSyncWorker }) {
		this.tickersUpdater = new WsTickersUpdater(apiKey, tickersHandlers)
		this.tickersUpdater.init()

		this.tabsSyncWorker = tabsSyncWorker
		this._initSecondaryTabRequestsListener()
	}

	_initSecondaryTabRequestsListener() {
		this.tabsSyncWorker.port.addEventListener(
			'message',
			this._handleRequest.bind(this)
		)
	}

	_handleRequest(e) {
		const header = e.data.header
		if (!header) return

		if (header === 'coinsDataRequest') {
			this._postCoinsData()
		}
	}

	_postCoinsData() {
		postMessage({
			header: 'coinsData',
			message: { coinsData: this.coinsData },
		})
	}

	async getCoinsData() {
		const result = await getCoinsData()
		this.coinsData = result
		return result
	}

	subscribeToTicker(tickerName, cb) {
		this.tickersUpdater.subscribeToTicker(tickerName, cb)
	}

	unsubscribeToTicker(tickerName) {
		this.tickersUpdater.unsubscribeToTicker(tickerName)
	}
}
