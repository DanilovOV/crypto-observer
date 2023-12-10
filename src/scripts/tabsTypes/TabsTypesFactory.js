import MainTab from './MainTab'
import SecondaryTab from './SecondaryTab'

export default class TabsTypesFactory {
	createTab(type, ...args) {
		switch (type) {
			case 'main':
				return new MainTab(...args)

			case 'secondary':
				return new SecondaryTab(...args)

			default:
				throw new Error(`Wrong tab type: ${type}`)
		}
	}
}
