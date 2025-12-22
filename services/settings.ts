import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    BIOMETRICS: 'settings_biometrics',
    SCREENSHOT_BLOCK: 'settings_screenshot_block',
};

export const SettingsService = {
    getBiometricsEnabled: async (): Promise<boolean> => {
        try {
            const value = await AsyncStorage.getItem(KEYS.BIOMETRICS);
            return value === 'true'; // Default false if null
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    setBiometricsEnabled: async (enabled: boolean) => {
        try {
            await AsyncStorage.setItem(KEYS.BIOMETRICS, String(enabled));
        } catch (e) {
            console.error(e);
        }
    },

    getScreenshotBlockEnabled: async (): Promise<boolean> => {
        try {
            const value = await AsyncStorage.getItem(KEYS.SCREENSHOT_BLOCK);
            return value === 'true';
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    setScreenshotBlockEnabled: async (enabled: boolean) => {
        try {
            await AsyncStorage.setItem(KEYS.SCREENSHOT_BLOCK, String(enabled));
        } catch (e) {
            console.error(e);
        }
    }
};
