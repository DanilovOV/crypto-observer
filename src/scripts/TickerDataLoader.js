import CryptocompareDataLoader from './compareDataLoader/CryptocompareLoader'

export default class TickerDataLoader {
	constructor(apiKey) {
		this.apiKey = apiKey
		this._setCompareDataLoader()
	}

	_setCompareDataLoader() {
		this._compareDataLoader = new CryptocompareDataLoader(this.apiKey)
	}

	async loadMultiData(tickersArr) {
		return await this._compareDataLoader.getCompareMultiData({
			arr: tickersArr,
			to: 'USD',
		})
	}

	async loadData(tickerName) {
		const compareData = await this._compareDataLoader.getCompareData({
			from: tickerName,
			to: 'USD',
		})

		if (compareData === null) {
			const crossCurrencyData =
				await this.getCrossCurrencyData(tickerName)
			return crossCurrencyData
		}

		return compareData
	}

	async getCrossCurrencyData(tickerName) {
		const compareData = await this._compareDataLoader.getCompareData({
			from: tickerName,
			to: 'BTC',
		})
		if (compareData === null) return null

		const costInUSD = await this._formatBtcToUsd(compareData.BTC)
		compareData.USD = costInUSD

		return compareData
	}

	async _formatBtcToUsd(costInBtc) {
		if (!costInBtc) return

		const btcData = await this._compareDataLoader.getCompareData({
			from: 'BTC',
			to: 'USD',
		})
		if (btcData === null) return null

		const btcToUsdCost = btcData.USD

		return costInBtc * btcToUsdCost
	}
}
