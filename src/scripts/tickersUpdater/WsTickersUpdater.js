import { postMessage } from '../../api/tabsSyncWorkerApi'
import TickersHandlers from '../TickersHandlers'

export default class WsTickersUpdater {
	aggregateIndex = 5

	constructor(apiKey, tickersHandlers) {
		this.apiKey = apiKey
		this.tickersHandlers = tickersHandlers
		this.tickersSubscriber = new TickersHandlers(this.tickersHandlers)
	}

	init() {
		this.socket = new WebSocket(
			`wss://streamer.cryptocompare.com/v2?api_key=${this.apiKey}`
		)
		this.socket.addEventListener('message', this._handleWsMessage.bind(this))
	}

	subscribeToTicker = (tickerName, cb) => {
		this.tickersSubscriber.addTickerHandler(tickerName.toUpperCase(), cb)

		this._sendMessage({
			action: 'SubAdd',
			subs: [`5~CCCAGG~${tickerName.toUpperCase()}~USD`],
		})
	}

	unsubscribeToTicker = (tickerName) => {
		this.tickersSubscriber.removeTickerHandlers(tickerName.toUpperCase())

		this._sendMessage({
			action: 'SubRemove',
			subs: [`5~CCCAGG~${tickerName.toUpperCase()}~USD`],
		})
	}

	_sendMessage(message) {
		if (this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(message))
			return
		}

		this.socket.addEventListener(
			'open',
			() => {
				this.socket.send(JSON.stringify(message))
			},
			{ once: true }
		)
	}

	_handleWsMessage(e) {
		const {
			TYPE: type,
			FROMSYMBOL: tickerName,
			PRICE: price,
		} = JSON.parse(e.data)
		console.log(e)
		if (type != this.aggregateIndex) return

		const newData = { tickerName, price }

		postMessage({ header: 'changeTickerPrice', message: newData })
		this.tickersSubscriber.executeHandlers(newData)
	}
}
