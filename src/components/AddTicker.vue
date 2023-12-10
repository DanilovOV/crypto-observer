<template>
	<section>
		<div class="flex">
			<div class="max-w-xs">
				<label
					for="wallet"
					class="block text-sm font-medium text-gray-700"
					>Тикер</label
				>
				<div class="mt-1 relative rounded-md shadow-md">
					<input
						type="text"
						name="wallet"
						id="wallet"
						v-model="newTickerName"
						@keydown.enter="addTicker()"
						@input="showAutocomplete(), (tickerExist = false)"
						class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
						placeholder="Например DOGE"
						autocomplete="off"
					/>
				</div>
				<div
					v-if="newTickerName"
					class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
				>
					<span
						class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
						v-for="(autocompleteName, index) of autocompleteNamesArr"
						:key="index"
						@click="addTicker(autocompleteName)"
					>
						{{ autocompleteName }}
					</span>
				</div>
				<div
					v-if="tickerExist"
					class="text-sm text-red-600"
				>
					Такой тикер уже добавлен
				</div>
			</div>
		</div>
		<add-button
			@click="addTicker(newTickerName)"
			type="button"
			class="my-4"
		/>
	</section>
</template>

<script>
import AddButton from './AddButton.vue'
import { getCoinsData } from '../api/subscribeApi'

export default {
	components: {
		AddButton,
	},

	props: {
		tickerExist: {
			type: Boolean,
			required: true,
		},
	},

	data() {
		return {
			newTickerName: '',
			coinsNames: Array,
			autocompleteNamesArr: Array,
		}
	},

	async created() {
		this.coinsNames = await getCoinsData()
	},

	methods: {
		async addTicker() {
			this.autocompleteNamesArr = []
			this.$emit('add-ticker', this.newTickerName.toUpperCase())
			this.newTickerName = ''
		},

		showAutocomplete() {
			this.autocompleteNamesArr = []
			if (this.newTickerName === '') return

			for (let i = 0; i < this.coinsNames.length; i++) {
				if (
					this.coinsNames[i].symbol
						.toUpperCase()
						.includes(this.newTickerName.toUpperCase()) ||
					this.coinsNames[i].fullName
						.toUpperCase()
						.includes(this.newTickerName.toUpperCase())
				) {
					this.autocompleteNamesArr.push(this.coinsNames[i].symbol)

					if (this.autocompleteNamesArr.length >= 4) break
				}
			}
		},
	},
}
</script>
