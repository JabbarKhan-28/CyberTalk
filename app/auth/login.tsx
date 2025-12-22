import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { useToast } from '@/components/Toast';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/auth';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={Colors.dark.text} size={24} />
        </TouchableOpacity>
        <CyberText variant="h1" glow>Welcome Back</CyberText>
        <CyberText variant="body" style={styles.subtitle}>Sign in to continue secure messaging</CyberText>
      </View>

      <View style={styles.form}>
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
      </View>

      <View style={styles.footer}>
        <CyberText variant="caption">Don't have an account? </CyberText>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <CyberText variant="caption" color={Colors.dark.primary} style={{ fontWeight: 'bold' }}>Register</CyberText>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 5,
  },
  form: {
    flex: 1,
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
