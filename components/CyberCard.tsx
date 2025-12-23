
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';

interface CyberCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'glowing';
}

export function CyberCard({ children, style, variant = 'default', ...props }: CyberCardProps) {
  return (
    <View 
      style={[
        styles.card, 
        variant === 'glowing' && styles.glowing,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Semi-transparent dark blue
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
      },
      default: {
        // Native blur would require Expo BlurView, falling back to simple transparency for now
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      }
    }),
  },
  glowing: {
    borderColor: 'rgba(34, 211, 238, 0.3)', // Cyan glow
    ...Platform.select({
      web: {
        boxShadow: '0 0 20px rgba(34, 211, 238, 0.1)',
      }
    }),
  }
});
