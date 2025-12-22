import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { CyberText } from './StyledText';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: any;
}

export function Input({ label, error, icon, style, containerStyle, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <CyberText variant="label" style={styles.label}>{label}</CyberText>}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        error ? styles.errorBorder : null
      ]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            styles.input, 
            style,
            // @ts-ignore
            Platform.OS === 'web' ? { 
              outlineStyle: 'none',
              transitionDelay: '99999s',
              transitionProperty: 'background-color, color',
            } : {}
          ]}
          placeholderTextColor={Colors.dark.icon}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          selectionColor={Colors.dark.primary}
          {...props}
        />
      </View>
      
      {error && <CyberText variant="caption" style={styles.errorText}>{error}</CyberText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: Colors.dark.text,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 12, // More rounded
    height: 56, // Taller touch target
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
    }),
  },
  focused: {
    borderColor: 'transparent',
    backgroundColor: Colors.dark.glass, // Keep original background
    ...Platform.select({
      web: {
        boxShadow: `0px 0px 8px ${Colors.dark.primary}`,
      },
      default: {
        shadowColor: Colors.dark.primary,
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    }),
  },
  errorBorder: {
    borderColor: Colors.dark.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
    height: '100%',
  },
  errorText: {
    color: Colors.dark.error,
    marginTop: 5,
  }
});
