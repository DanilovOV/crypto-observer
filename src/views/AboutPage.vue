<template>
	<StandartPageLayout>
		<Section>
			<div class="about-us-container">
				<section
					v-for="(item, index) in aboutUsData"
					:key="index"
					class="about-us-item"
				>
					<div class="about-us-content">
						<h2 class="about-us-title">{{ item.title }}</h2>
						<img
							:src="item.image"
							alt="about-us-image"
							class="about-us-image"
						/>
						<p class="about-us-text">{{ item.text }}</p>
					</div>
				</section>
			</div>
		</Section>
	</StandartPageLayout>
</template>

<script>
import StandartPageLayout from '@/components/layout/StandartPageLayout.vue'
import Section from '@/components/layout/components/Section.vue'

export default {
	components: { StandartPageLayout, Section },
	data() {
		return {
			aboutUsData: [
				{
					title: 'История компании',
					text: 'Наш проект начал свою историю в 2022 году с целью создания удобной и информативной платформы для отслеживания курсов криптовалют. Мы стремились предоставить пользователям легкий доступ к актуальным данным о криптовалютном рынке, чтобы каждый мог принимать осознанные решения в мире цифровых активов.',
					image: 'your-image-url1.jpg',
				},
				{
					title: 'Миссия и ценности',
					text: 'Наша миссия - делать информацию о криптовалютах доступной и понятной для всех. Мы верим в прозрачность, образование и поддержку наших пользователей, помогая им разобраться в динамике рынка и успешно управлять своими инвестициями.',
					image: 'your-image-url2.jpg',
				},
				{
					title: 'Команда',
					text: 'За нашим проектом стоит команда опытных специалистов в области финансов, технологий и образования. Мы обладаем разносторонними знаниями и страстью к криптовалютам, что позволяет нам создавать полезные и инновационные решения для наших пользователей.',
					image: 'your-image-url3.jpg',
				},
				{
					title: 'Результаты и достижения',
					text: 'За короткий период своего существования мы рады поддерживать активное сообщество пользователей, которые доверяют нам для отслеживания криптовалютных курсов. Наши достижения включают в себя не только численные показатели, но и положительные отзывы и истории успеха наших пользователей.',
					image: 'your-image-url4.jpg',
				},
				{
					title: 'Контактная информация',
					text: 'Мы всегда открыты для обратной связи и вопросов. Если у вас есть какие-либо вопросы или предложения, не стесняйтесь связаться с нами по электронной почте по адресу info@cryptocoursewatch.com или заполните форму обратной связи на нашем сайте.',
					image: 'your-image-url5.jpg',
				},
				{
					title: 'Будущие планы',
					text: 'Мы стремимся постоянно улучшать наш сервис. В ближайших планах - расширение списка поддерживаемых криптовалют, внедрение новых функциональностей и предоставление еще более точной и своевременной информации.',
					image: 'your-image-url6.jpg',
				},
				{
					title: 'Социальные медиа и обратная связь',
					text: 'Присоединяйтесь к нам в социальных сетях для получения последних обновлений и общения с нашей командой. Мы ценим ваше мнение, поэтому не забудьте оставить отзывы и предложения на наших страницах в социальных медиа.',
					image: 'your-image-url7.jpg',
				},
			],
		}
	},
}
</script>

<style scoped>
.about-us-container {
	display: flex;
	flex-direction: column;
}

.about-us-item {
	margin-bottom: 20px;
	border: 1px solid #eaeaea;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.about-us-image {
	width: 100%;
	height: 150px;
	object-fit: cover;
}

.about-us-content {
	padding: 16px;
}

.about-us-title {
	color: #3498db;
}

.about-us-text {
	color: #333;
}
</style>
