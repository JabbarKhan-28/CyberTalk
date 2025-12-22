import { Colors } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, Platform, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { CyberText } from './StyledText';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, onPress, variant = 'primary', loading = false, style }: ButtonProps) {
  let backgroundColor = Colors.dark.primary;
  let textColor = '#000';
  let borderColor = 'transparent';
  let borderWidth = 0;

  if (variant === 'secondary') {
    backgroundColor = Colors.dark.surfaceHighlight;
    textColor = Colors.dark.text;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    borderColor = Colors.dark.primary;
    borderWidth = 1;
    textColor = Colors.dark.primary;
  } else if (variant === 'danger') {
    backgroundColor = Colors.dark.error;
    textColor = '#fff';
  } else if (variant === 'success') {
    backgroundColor = Colors.dark.success;
    textColor = '#000';
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor, borderWidth },
        style,
        loading && { opacity: 0.7 }
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <CyberText variant="label" style={{ color: textColor, textTransform: 'uppercase' }}>
          {title}
        </CyberText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 12,
    // Cyber glow for primary
    ...Platform.select({
      web: {
        boxShadow: `0px 4px 10px ${Colors.dark.primary}`,
      },
      default: {
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },
});
