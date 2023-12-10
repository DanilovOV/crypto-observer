export default class TickersHandlers {
	constructor(tickersHandlersMap) {
		this.tickersHandlers = tickersHandlersMap
	}

	addTickerHandler = (ticker, cb) => {
		const subscribers = this.tickersHandlers.get(ticker) || []
		this.tickersHandlers.set(ticker, [...subscribers, cb])
	}

	removeTickerHandlers = (ticker) => {
		this.tickersHandlers.delete(ticker)
	}

	executeHandlers = ({ tickerName, price }) => {
		this.tickersHandlers.get(tickerName ?? []).forEach((fn) => fn(price))
	}
}
