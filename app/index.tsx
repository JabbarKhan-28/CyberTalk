import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth state and loading keys
    const prepare = async () => {
      // Short delay for splash effect
      setTimeout(() => {
        // Mock: If not logged in, go to Onboarding
        // If logged in, go to (tabs)
        router.replace('/onboarding');
      }, 2000);
    };

    prepare();
  }, []);

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.content}>
        <ShieldCheck size={80} color={Colors.dark.primary} style={styles.icon} />
        <CyberText variant="h1" glow color={Colors.dark.primary}>CyberTalk</CyberText>
        <CyberText variant="body" style={styles.subtitle}>Secure. Encrypted. Anonymous.</CyberText>
        
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
          <CyberText variant="caption" style={{ marginTop: 10 }}>Initializing Secure Store...</CyberText>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: 20,
    shadowColor: Colors.dark.primary,
    shadowRadius: 20,
    shadowOpacity: 0.5,
  },
  subtitle: {
    marginTop: 10,
    opacity: 0.7,
  },
  loader: {
    marginTop: 50,
    alignItems: 'center',
  }
});
