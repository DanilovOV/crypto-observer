import { requestWorkerData } from '../../api/tabsSyncWorkerApi'
import TickersHandlers from '../TickersHandlers'

export default class SecondaryTab {
	constructor({ tickersHandlers, tabsSyncWorker }) {
		this.tickersHandlers = tickersHandlers
		this.tickersSubscriber = new TickersHandlers(this.tickersHandlers)
		this.tabsSyncWorker = tabsSyncWorker

		this.tabsSyncWorker.port.addEventListener(
			'message',
			this._handleMessage.bind(this)
		)
	}

	async getCoinsData() {
		return await requestWorkerData({
			requestHeader: 'coinsDataRequest',
			responceHeader: 'coinsData',
		})
	}

	subscribeToTicker = (tickerName, cb) => {
		this.tickersSubscriber.addTickerHandler(tickerName.toUpperCase(), cb)
	}

	unsubscribeToTicker(tickerName) {
		this.tickersSubscriber.removeTickerHandlers(tickerName.toUpperCase())
	}

	_handleMessage(e) {
		const header = e.data.header
		const message = e.data.message
		if (!header) return

		if (header === 'changeTickerPrice') {
			this.tickersSubscriber.executeHandlers(message)
		}
	}
}
