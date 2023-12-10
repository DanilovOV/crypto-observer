export default async function getCoinsData() {
	const responce = await fetch(
		'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
	)
	if (!responce.ok) throw new Error(responce)

	const coinsResponceObj = await responce.json()
	const coinsFullData = coinsResponceObj.Data

	const result = Object.values(coinsFullData).map((value) => ({
		symbol: value.Symbol,
		fullName: value.FullName,
	}))

	return result
}
