const storage = () => {
	if (typeof window !== 'object') return null
	try {
		return window.localStorage
	} catch (error) {
		return null
	}
}

const withStorage = (fn, fallback) => (...args) => {
	try {
		const target = storage()
		if (!target) return Promise.resolve(fallback)
		const result = fn(target, ...args)
		return Promise.resolve(result)
	} catch (error) {
		console.warn('[cookies] storage access failed:', error)
		return Promise.resolve(fallback)
	}
}

export default {
	set: withStorage((target, key, value) => target.setItem(key, value)),
	get: withStorage((target, key) => target.getItem(key), null),
	clear: withStorage((target) => target.clear())
}
