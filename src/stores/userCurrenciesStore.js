import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserCurrenciesStore = defineStore('userCurrenciesStore', () => {
	const сurrencies = ref(new Map())

	const saveCurrArrToStorage = () => {
		const currenciesArray = Array.from(сurrencies.value.values()).map(
			(currData) => currData.name
		)
		localStorage.setItem('user-currencies', JSON.stringify(currenciesArray))
	}

	const isContainsCurr = (name) => {
		return сurrencies.value.has(name.toUpperCase())
	}

	const addCurr = (currName) => {
		const newCurr = {
			id: сurrencies.value.size + 1,
			name: currName.toUpperCase(),
			value: '-',
			isError: false,
		}

		сurrencies.value.set(newCurr.name, newCurr)
		saveCurrArrToStorage()
	}

	const deleteCurr = (currName) => {
		const upperName = currName.toUpperCase()
		сurrencies.value.delete(upperName)
		saveCurrArrToStorage()
	}

	const filterCurr = (currName) => {
		return Array.from(сurrencies.value.values()).filter((currData) =>
			currData.name.includes(currName.toUpperCase())
		)
	}

	const updateCurrValue = (currName, price) => {
		const curr = сurrencies.value.get(currName.toUpperCase())
		if (curr) {
			curr.value = price
		}
	}

	return {
		сurrencies,
		isContainsCurr,
		addCurr,
		deleteCurr,
		filterCurr,
		updateCurrValue,
	}
})
