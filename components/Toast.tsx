import { Colors } from '@/constants/Colors';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react-native';
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

  const getIcon = () => {
      switch (type) {
          case 'success': return <CheckCircle size={24} color={Colors.dark.success} />;
          case 'error': return <AlertTriangle size={24} color={Colors.dark.error} />;
          default: return <Info size={24} color={Colors.dark.primary} />;
      }
  };

  const getBorderColor = () => {
      switch (type) {
          case 'success': return Colors.dark.success;
          case 'error': return Colors.dark.error;
          default: return Colors.dark.primary;
      }
  };

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      {visible && (
        <View style={[
            styles.container, 
            { 
                top: insets.top + 10,
                borderColor: getBorderColor(),
                shadowColor: getBorderColor(),
            }
        ]}>
          <View style={styles.iconContainer}>
              {getIcon()}
          </View>
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
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)', // Dark glass
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
    ...Platform.select({
      web: {
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
      },
      default: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 10,
      },
    }),
  },
  iconContainer: {
      marginRight: 12,
  },
  text: {
    color: '#FFF',
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});
