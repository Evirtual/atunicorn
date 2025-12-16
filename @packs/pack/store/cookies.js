const isBrowser = typeof window === 'object'

const memory = new Map()

const storage = {
	async setItem(key, value) {
		if (!key) return
		if (isBrowser && window.localStorage) {
			window.localStorage.setItem(String(key), String(value))
			return
		}
		memory.set(String(key), String(value))
	},

	async getItem(key) {
		if (!key) return null
		if (isBrowser && window.localStorage) return window.localStorage.getItem(String(key))
		return memory.get(String(key)) || null
	},

	async clear() {
		if (isBrowser && window.localStorage) {
			window.localStorage.clear()
			return
		}
		memory.clear()
	}
}

export default {
	set: storage.setItem,
	get: storage.getItem,
	clear: storage.clear
}
