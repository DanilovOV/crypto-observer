export default function callAfterPromise(promise) {
	return (method) =>
		async (...args) => {
			await promise
			return await method(...args)
		}
}
