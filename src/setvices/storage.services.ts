import AsyncStorage from '@react-native-async-storage/async-storage';

export const localStorage = {
    storeData : async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
            return true;
        } catch (_e) {
            console.warn('Error storing data', _e);
            return false;
        }
    },
    removeData :async (key: string) => {
        try {
            await AsyncStorage.removeItem(key)
            return true
        } catch (error) {
            console.warn('Error removing data', error);
            return false
        }
    },

    getData:async (key:string) => { 
        try {
            return await AsyncStorage.getItem(key)
        } catch (error) {
            console.warn('Error getting data', error);
            return null
        }
    }
}



