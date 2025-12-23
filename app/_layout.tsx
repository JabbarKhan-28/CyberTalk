import { Colors } from '@/constants/Colors';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

import { ToastProvider } from '@/components/Toast';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay or when resources are loaded
    const hideSplash = async () => {
        try {
            // Check for fonts or auth initialization here if needed
            // For now, just hide it after mount
            // Ensure we wait long enough for navigation to mount
            await new Promise(resolve => setTimeout(resolve, 1000)); 
        } catch (e) {
            console.warn("Splash screen error:", e);
        } finally {
            // ALWAYS hide splash screen, even if initialization failed
            await SplashScreen.hideAsync();
        }
    };
    hideSplash();
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <ToastProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.dark.background,
            },
            headerTintColor: Colors.dark.tint,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: Colors.dark.background,
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings/security" options={{ title: 'Security' }} />
          <Stack.Screen name="keys/exchange" options={{ title: 'Key Exchange' }} />
        </Stack>
        <StatusBar style="light" />
      </ToastProvider>
    </ThemeProvider>
  );
}
