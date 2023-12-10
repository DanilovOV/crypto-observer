const routes = [
	{
		path: '/',
		name: 'Main',
		component: () => import('@/views/MainPage.vue'),
	},
	{
		path: '/about',
		name: 'About',
		component: () => import('@/views/AboutPage.vue'),
	},
]

export default routes
