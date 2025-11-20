import * as LocalAuthentication from 'expo-local-authentication';
import { STORAGE_KEYS } from '../constants/constant';
import { localStorage } from './storage.services';

export const biometricAuth = {
    setBiometric: async () => { 
        try {
            const res = await LocalAuthentication.authenticateAsync()
            if (res?.success) { 
                await localStorage.storeData(STORAGE_KEYS.FACE_ID, `face_id+${new Date().getTime()}`)
                return true
            }
            return false
        } catch (error) {
            return false
        }
    } 
}
