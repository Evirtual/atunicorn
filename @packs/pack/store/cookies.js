import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
	set: AsyncStorage.setItem,
	get: AsyncStorage.getItem,
	clear: AsyncStorage.clear
}
