<template>
	<header class="site-header w-full">
		<div class="logo">
			<img
				src="/icons/favicon-48x48.png"
				alt="Логотип"
			/>
		</div>

		<nav class="main-menu">
			<ul>
				<li><router-link to="/">Главная</router-link></li>
				<li><router-link to="/about">О нас</router-link></li>
				<li><router-link to="/services">Услуги</router-link></li>
				<li><router-link to="/home">Профиль</router-link></li>
			</ul>
		</nav>

		<div class="search-bar">
			<input
				type="text"
				placeholder="Поиск"
				v-model="searchQuery"
			/>
			<button @click="search">Искать</button>
		</div>
	</header>
</template>

<script>
export default {
	data() {
		return {
			searchQuery: '',
		}
	},
	methods: {
		search() {
			console.log('Выполняется поиск:', this.searchQuery)
		},
	},
}
</script>

<style scoped>
.site-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	background-color: #f0f0f0;
}

.logo img {
	max-height: 50px;
}

.main-menu ul {
	list-style-type: none;
	display: flex;
	gap: 20px;
}

.main-menu li {
	font-size: 16px;
}

.search-bar {
	display: flex;
	gap: 10px;
}

.search-bar input {
	padding: 8px;
	font-size: 14px;
}

.search-bar button {
	padding: 8px;
	font-size: 14px;
	cursor: pointer;
}
</style>
