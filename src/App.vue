<template>
	<TheWrapper>
		<TheHeader />
		<div class="p-8">
			<FormAddTicker
				@add-ticker="tryAddTicker"
				:ticker-exist="tickerExist"
				@input="tickerExist = false"
			/>

			<template v-if="userCurrencies.сurrencies.size">
				<hr class="w-full border-t border-gray-600 my-4" />

				<template v-if="userCurrencies.сurrencies.size > 1">
					<div class="flex items-end">
						<AppInput
							type="text"
							label="Поиск тикера"
							placeholder="Имя тикера"
							v-model="tickerNameFilter"
							class="max-w-xs"
						/>
						<AppButton v-if="page > 1" @click="pagePrev()" class="ml-2"
							>Назад</AppButton
						>
						<AppButton v-if="hasNextPage" @click="pageNext()" class="ml-2"
							>Вперед</AppButton
						>
					</div>
				</template>

				<dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
					<AppTicker
						v-for="tickerItem of paginatedTickersArr"
						:key="tickerItem.id"
						:currency="tickerItem.name"
						:price="getFormattedPrice(tickerItem.value)"
						:isActive="selectedTicker === tickerItem"
						:isError="tickerItem.isError"
						@click="setActiveTicker(tickerItem)"
						@delete="deleteTicker(tickerItem.name)"
					/>
				</dl>

				<PriceGraph
					ref="graph"
					:ticker="selectedTicker"
					@unselectTicker="this.selectedTicker = null"
				/>
			</template>
		</div>
	</TheWrapper>
</template>

<script>
import TheWrapper from '@/components/layout/TheWrapper.vue'
import TheHeader from '@/components/layout/TheHeader.vue'

import FormAddTicker from '@/components/FormAddTicker.vue'
import PriceGraph from '@/components/PriceGraph.vue'
import {
	subscribeToAddTickers,
	subscribeToRemoveTickers,
} from '@/api/sharedTickersApi'
import { subscribeToTicker, unsubscribeToTicker } from '@/api/subscribeApi'
import { useUserCurrenciesStore } from '@/stores/userCurrenciesStore.js'

import AppButton from './components/global/AppButton.vue'
import AppInput from './components/global/AppInput.vue'
import AppTicker from './components/AppTicker.vue'

export default {
	name: 'HomePage',

	components: {
		TheWrapper,
		TheHeader,
		FormAddTicker,
		PriceGraph,
		AppButton,
		AppInput,
		AppTicker,
	},

	data() {
		return {
			tickerNameFilter: '',
			selectedTicker: null,
			tickerExist: false,
			page: 1,
			tickersOnPage: 6,
		}
	},

	async created() {
		const setStartUrlParams = () => {
			const urlData = Object.fromEntries(
				new URL(window.location).searchParams.entries()
			)

			if (urlData.filter) {
				this.tickerNameFilter = urlData.filter
			}

			if (urlData.page) {
				this.page = urlData.page
			}
		}

		const downloadStorageTickers = () => {
			const tickersStorageData = localStorage.getItem('user-currencies')
			if (!tickersStorageData) return

			const storageTickerNamesArr = JSON.parse(tickersStorageData)
			storageTickerNamesArr.forEach((tickerName) =>
				this.addTicker(tickerName, true)
			)
		}

		const subscribeToSharedTickers = () => {
			subscribeToAddTickers(this.addTicker)
			subscribeToRemoveTickers(this.deleteTicker)
		}

		downloadStorageTickers()
		setStartUrlParams()
		subscribeToSharedTickers()
	},

	methods: {
		tryAddTicker(newTickerName) {
			if (!newTickerName) return

			if (this.userCurrencies.isContainsCurr(newTickerName))
				this.tickerExist = true
			else this.addTicker(newTickerName)
		},

		async addTicker(tickerName, isWorkerCallback) {
			this.userCurrencies.addCurr(tickerName)

			subscribeToTicker(
				tickerName.toUpperCase(),
				(newPrice) => this.updateTicker(tickerName.toUpperCase(), newPrice),
				isWorkerCallback
			)

			this.newTickerName = ''
		},

		updateTicker(tickerName, price) {
			this.userCurrencies.updateCurrValue(tickerName, price)

			if (this.selectedTicker && tickerName === this.selectedTicker.name) {
				this.$refs.graph.addValue(this.selectedTicker.value)
			}
		},

		deleteTicker(tickerName, isWorkerCallback) {
			this.userCurrencies.deleteCurr(tickerName)

			if (tickerName === this.selectedTicker?.name) {
				this.selectedTicker = null
			}

			unsubscribeToTicker(tickerName, isWorkerCallback)
		},

		getFormattedPrice(price) {
			if (price === '-') return price
			return price > 1 ? price.toFixed(2) : price.toPrecision(2)
		},

		setActiveTicker(tickerItem) {
			if (this.selectedTicker === tickerItem) {
				this.selectedTicker = null
			} else {
				this.selectedTicker = tickerItem
			}
		},

		pagePrev() {
			if (this.page > 1) this.page--
		},

		pageNext() {
			if (this.hasNextPage) this.page++
		},
	},

	computed: {
		userCurrencies() {
			return useUserCurrenciesStore()
		},

		pageStateOptions() {
			return {
				tickerNameFilter: this.tickerNameFilter,
				page: this.page,
			}
		},

		filteredTickersArr() {
			return this.userCurrencies.filterCurr(this.tickerNameFilter.toUpperCase())
		},

		hasNextPage() {
			return (
				this.page <
				Math.ceil(this.filteredTickersArr.length / this.tickersOnPage)
			)
		},

		paginatedTickersArr() {
			return this.filteredTickersArr.slice(
				this.filteredArrSliceStart,
				this.filteredArrSliceEnd
			)
		},

		filteredArrSliceStart() {
			return (this.page - 1) * this.tickersOnPage
		},

		filteredArrSliceEnd() {
			return this.filteredArrSliceStart + 6
		},
	},

	watch: {
		paginatedTickersArr() {
			if (this.paginatedTickersArr.length == 0 && this.page > 1) {
				this.page--
			}
		},

		tickerNameFilter() {
			this.page = 1
		},

		pageStateOptions(value) {
			window.history.pushState(
				null,
				document.title,
				`${window.location.pathname}?filter=${value.tickerNameFilter}&page=${value.page}`
			)
		},
	},
}
</script>

<style lang="scss" src="@/styles/app.scss"></style>
