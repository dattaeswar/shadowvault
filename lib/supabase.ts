import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://hgfnpcgfqwqyllzhxlpw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_GbUcHZvqAWqbaaOH4GTjSg_MQCekcLc';

// Check if running on server (during static build)
const isServer = Platform.OS === 'web' && typeof window === 'undefined';

// Safe storage adapter to avoid "window is not defined" error during build
const storageAdapter = {
    getItem: (key: string) => {
        if (isServer) return Promise.resolve(null);
        return AsyncStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        if (isServer) return Promise.resolve();
        return AsyncStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
        if (isServer) return Promise.resolve();
        return AsyncStorage.removeItem(key);
    },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: storageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
