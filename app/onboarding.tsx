import { Button } from '@/components/Button';
import { CyberCard } from '@/components/CyberCard';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Lock, Shield } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper style={styles.container}>
      <CyberCard variant="glowing" style={styles.card}>
        <View style={styles.header}>
            <View style={styles.iconContainer}>
            <Shield size={100} color={Colors.dark.primary} />
            <View style={styles.lockBadge}>
                <Lock size={30} color="#000" />
            </View>
            </View>
            
            <CyberText variant="h1" glow style={styles.title}>CyberTalk</CyberText>
            <CyberText variant="body" style={styles.description}>
            The next generation of secure communication. 
            Diffie–Hellman Key Exchange + AES Encryption.
            </CyberText>
        </View>

        <View style={styles.footer}>
            <Button 
            title="Login" 
            onPress={() => router.push('/auth/login')} 
            />
            <Button 
            title="Create Account" 
            variant="outline" 
            onPress={() => router.push('/auth/register')} 
            />
        </View>
      </CyberCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: Colors.dark.secondary,
    borderRadius: 20,
    padding: 5,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    color: Colors.dark.icon,
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  footer: {
    width: '100%',
    gap: 15,
  }
});
