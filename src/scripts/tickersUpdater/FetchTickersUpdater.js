import TickerDataLoader from '../TickerDataLoader'
import TickersHandlers from '../TickersHandlers'

export default class FetchTickersUpdater {
	constructor(apiKey, tickersHandlers) {
		this.apiKey = apiKey
		this.tickersHandlers = tickersHandlers
		this.tickersSubscriber = new TickersHandlers(this.tickersHandlers)
		this.tickerDataLoader = new TickerDataLoader(apiKey)
	}

	init() {
		setInterval(this._changeTickersPrice.bind(this), 5000)
	}

	subscribeToTicker = (tickerName, cb) => {
		this.tickersSubscriber.addTickerHandler(tickerName, cb)
	}

	unsubscribeToTicker = (tickerName) => {
		this.tickersSubscriber.removeTickerHandlers(tickerName)
	}

	async _changeTickersPrice() {
		if (this.tickersHandlers.size === 0) return

		const newTickersData = await this.tickerDataLoader.loadMultiData(
			this.tickersHandlers.keys()
		)

		Object.entries(newTickersData).forEach(([tickerName, newPrice]) => {
			const tickerHandlers = this.tickersHandlers.get(tickerName ?? [])
			tickerHandlers.forEach((handlerFunc) => handlerFunc(newPrice))
		})
	}
}
