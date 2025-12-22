import { Colors } from '@/constants/Colors';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CyberText } from './StyledText';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const insets = useSafeAreaInsets();

  const show = useCallback((msg: string, t: ToastType = 'info') => {
    setMessage(msg);
    setType(t);
    setVisible(true);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        setVisible(false);
    }, 3000);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      {visible && (
        <View style={[
            styles.container, 
            { top: insets.top + 10 },
            type === 'success' && styles.success,
            type === 'error' && styles.error,
        ]}>
          <CyberText variant="body" style={styles.text}>{message}</CyberText>
        </View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    zIndex: 9999,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      },
    }),
    alignItems: 'center',
  },
  success: {
    backgroundColor: 'rgba(0, 255, 157, 0.9)',
    borderColor: Colors.dark.success,
  },
  error: {
    backgroundColor: 'rgba(255, 0, 85, 0.9)',
    borderColor: Colors.dark.error,
  },
  text: {
    color: '#000', // Black text usually reads better on bright green/red backgrounds, or white if backgrounds are dark. 
                   // Given the rgba above are high opacity, black might be safer or bold white.
                   // Let's stick to what contrasts well.
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
