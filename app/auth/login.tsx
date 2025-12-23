import { Button } from '@/components/Button';
import { CyberCard } from '@/components/CyberCard';
import { Input } from '@/components/Input';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { useToast } from '@/components/Toast';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/auth';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.show('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
        await AuthService.login(email, password);
        toast.show('Welcome back!', 'success');
        router.replace('/(tabs)');
    } catch (error: any) {
        toast.show(error.message || 'Login Failed', 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={Colors.dark.text} size={24} />
        </TouchableOpacity>

        <View style={styles.header}>
            <CyberText variant="h1" glow>Welcome Back</CyberText>
            <CyberText variant="body" style={styles.subtitle}>Sign in to continue secure messaging</CyberText>
        </View>

        <CyberCard variant="glowing" style={styles.formCard}>
            <Input
            label="Email"
            placeholder="user@cybertalk.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={20} color={Colors.dark.icon} />}
            />
            
            <Input
            label="Password"
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={20} color={Colors.dark.icon} />}
            />
            
            <TouchableOpacity style={styles.forgotPassword}>
            <CyberText variant="caption" color={Colors.dark.primary}>Forgot Password?</CyberText>
            </TouchableOpacity>

            <Button 
            title="Login" 
            onPress={handleLogin} 
            loading={loading}
            style={{ marginTop: 20 }}
            />
        </CyberCard>
        
        <View style={styles.footer}>
            <CyberText variant="caption">Don't have an account? </CyberText>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <CyberText variant="caption" color={Colors.dark.primary} style={{ fontWeight: 'bold' }}>Register</CyberText>
            </TouchableOpacity>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
    width: '100%',
    maxWidth: 400,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 5,
  },
  formCard: {
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  }
});
