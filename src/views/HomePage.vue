<template>
	<!-- <div class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center">
				<svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
					viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
					</path>
				</svg>
			</div> -->

	<add-ticker
		@add-ticker="tryAddTicker"
		:ticker-exist="tickerExist"
	/>

	<template v-if="userCurrencies.сurrencies.size">
		<hr class="w-full border-t border-gray-600 my-4" />

		<template v-if="userCurrencies.сurrencies.size > 1">
			<input
				type="text"
				placeholder="Имя тикера"
				v-model="tickerNameFilter"
			/>
			<button
				v-if="page > 1"
				@click="pagePrev()"
				class="mr-2 ml-2 my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
			>
				Назад
			</button>
			<button
				v-if="hasNextPage"
				@click="pageNext()"
				class="mr-2 ml-2 my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
			>
				Вперед
			</button>
			<hr class="w-full border-t border-gray-600 my-4" />
		</template>

		<dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
			<div
				class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
				v-for="tickerItem of paginatedTickersArr"
				:key="tickerItem.id"
				@click="setActiveTicker(tickerItem)"
				:class="{ 'border-4': selectedTicker === tickerItem }"
			>
				<div
					class="px-4 py-5 sm:p-6 text-center"
					:class="{ 'bg-red-100': tickerItem.isError }"
				>
					<dt class="text-sm font-medium text-gray-500 truncate">
						{{ tickerItem.name }} - USD
					</dt>
					<dd class="mt-1 text-3xl font-semibold text-gray-900">
						{{ getFormattedPrice(tickerItem.value) }}
					</dd>
				</div>
				<div class="w-full border-t border-gray-200"></div>
				<button
					class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
					@click.stop="deleteTicker(tickerItem.name)"
				>
					<svg
						class="h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="#718096"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span>Удалить</span>
				</button>
			</div>
		</dl>

		<price-graph
			ref="graph"
			:ticker="selectedTicker"
			@unselectTicker="this.selectedTicker = null"
		/>
	</template>
</template>

<script>
import AddTicker from '@/components/AddTicker.vue'
import PriceGraph from '@/components/PriceGraph.vue'
import {
	subscribeToAddTickers,
	subscribeToRemoveTickers,
} from '@/api/sharedTickersApi'
import { subscribeToTicker, unsubscribeToTicker } from '@/api/subscribeApi'

import { useUserCurrenciesStore } from '@/stores/userCurrenciesStore.js'

export default {
	name: 'HomePage',

	components: {
		AddTicker,
		PriceGraph,
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
			if (newTickerName === '') return

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
			return Math.ceil(this.filteredTickersArr.length / this.tickersOnPage)
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
