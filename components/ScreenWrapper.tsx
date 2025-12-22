import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: any;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
  return (
    <LinearGradient
      colors={[Colors.dark.gradientStart, Colors.dark.gradientMiddle, Colors.dark.gradientEnd]}
      locations={[0, 0.4, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={[styles.safeArea, style]}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
