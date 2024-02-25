<!-- eslint-disable vue/no-mutating-props -->
<template>
	<section>
		<div class="flex">
			<div class="max-w-xs">
				<AppInput
					v-model="newTickerName"
					label="Тикер"
					placeholder="Например DOGE"
					class="relative"
					autocomplete="off"
					@keydown.enter="addTicker(autocompleteNamesArr[0])"
					@input="handleInput(), (tickerExist = false)"
				/>

				<div
					v-if="newTickerName && autocompleteNamesArr.length"
					class="flex bg-white p-1 rounded-md shadow-md flex-wrap"
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
		<AddButton
			@click="addTicker(newTickerName)"
			type="button"
			class="my-4"
		/>
	</section>
</template>

<script>
import { getCoinsData } from '@/api/subscribeApi'
import AddButton from './AddButton.vue'
import AppInput from './AppInput.vue'

export default {
	components: {
		AddButton,
		AppInput,
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
		async addTicker(name) {
			this.autocompleteNamesArr = []
			this.showAutocomplete = false
			this.$emit('add-ticker', name.toUpperCase())
			this.newTickerName = ''
		},

		handleInput() {
			this.autocompleteNamesArr = []
			this.showAutocomplete = true

			if (this.newTickerName === '') {
				this.showAutocomplete = false
				return
			}

			this.updateAutocompleteNames()
		},

		updateAutocompleteNames() {
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
