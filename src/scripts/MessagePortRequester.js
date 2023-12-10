export default class MessagePortRequester {
	constructor({ getPortMethod, postMessageMethod }) {
		this.getPortMethod = getPortMethod
		this.postMessage = postMessageMethod
	}

	get port() {
		return this.getPortMethod()
	}

	async requestData({ requestHeader, responceHeader }) {
		this.postMessage({ messagePort: this.port, header: requestHeader })
		return await this.waitData({ responceHeader })
	}

	async waitData({ responceHeader }) {
		let result
		let resultReceived
		const resultPromise = new Promise((resolve) => (resultReceived = resolve))

		this.port.addEventListener('message', getMessage)

		function getMessage(e) {
			const header = e.data.header
			const message = e.data.message
			console.log(header, responceHeader)
			if (!header) return

			if (header === responceHeader) {
				result = message.coinsData
				resultReceived()
			}
		}

		await resultPromise
		this.port.removeEventListener('message', getMessage)

		return result
	}
}
