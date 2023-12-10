import CompareDataLoader from './CompareDataLoader'

export default class CryptocompareDataLoader extends CompareDataLoader {
	constructor(...args) {
		super(...args)
	}

	async getCompareData({ from, to }) {
		if (!from || !to) {
			return null
		}

		const tickerData = await fetch(
			`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}&api_key=${this.apiKey}`
		)

		const result = await tickerData.json()

		if (result.Response == 'Error') {
			return null
		}

		return result
	}

	async getCompareMultiData({ arr, to }) {
		if (!arr || !to) {
			return null
		}

		const namesStr = [...arr].join(',')
		const tickerData = await fetch(
			`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${namesStr}&tsyms=USD&api_key=${this.apiKey}`
		)

		const rawData = await tickerData.json()
		const formattedData = Object.fromEntries(
			Object.entries(rawData).map(([key, value]) => [key, value.USD])
		)

		return formattedData
	}
}
