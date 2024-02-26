<template>
	<TheWrapper>
		<TheHeader />
		<div class="p-8">
			<AddTicker
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
							<AppIcon fill name="Delete" class="mr-1" />
							<span>Удалить</span>
						</button>
					</div>
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

import AddTicker from '@/components/AddTicker.vue'
import PriceGraph from '@/components/PriceGraph.vue'
import {
	subscribeToAddTickers,
	subscribeToRemoveTickers,
} from '@/api/sharedTickersApi'
import { subscribeToTicker, unsubscribeToTicker } from '@/api/subscribeApi'
import { useUserCurrenciesStore } from '@/stores/userCurrenciesStore.js'

import AppIcon from './components/global/AppIcon.vue'
import AppButton from './components/global/AppButton.vue'
import AppInput from './components/global/AppInput.vue'

export default {
	name: 'HomePage',

	components: {
		TheWrapper,
		TheHeader,
		AddTicker,
		PriceGraph,
		AppIcon,
		AppButton,
		AppInput,
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

<style lang="scss" src="@/styles/app.scss"></style>
