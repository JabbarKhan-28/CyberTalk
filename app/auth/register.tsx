import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { useToast } from '@/components/Toast';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/auth';
import { generateOTP, sendOTP } from '@/services/otp';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, Lock, Mail, User } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const toast = useToast();
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP State
  const [step, setStep] = useState(0); // 0: Form, 1: OTP
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Validate and Send OTP
  const handleVerifyEmail = async () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.show('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      toast.show('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
        const otp = generateOTP();
        setGeneratedOtp(otp);
        console.log("GENERATED OTP:", otp); // For debugging if email fails
        
        await sendOTP(email, otp, name);
        
        toast.show(`Verification code sent to ${email}`, 'success');
        setStep(1);
    } catch (error) {
        toast.show('Failed to send OTP. Please check your email.', 'error');
    } finally {
        setLoading(false);
    }
  };

  // Step 2: Verify OTP and Create Account
  const handleRegister = async () => {
      if (userOtp !== generatedOtp) {
          toast.show('Invalid OTP Code', 'error');
          return;
      }

      setLoading(true);
      try {
          await AuthService.register(email, password, name);
          toast.show('Account created successfully!', 'success');
          router.replace('/(tabs)');
      } catch (error: any) {
          toast.show(error.message || 'Registration Failed', 'error');
      } finally {
          setLoading(false);
      }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step === 1 ? setStep(0) : router.back()} style={styles.backButton}>
            <ArrowLeft color={Colors.dark.text} size={24} />
          </TouchableOpacity>
          <CyberText variant="h1" glow>{step === 0 ? 'Create Account' : 'Verify Email'}</CyberText>
          <CyberText variant="body" style={styles.subtitle}>
              {step === 0 ? 'Join the secure network.' : `Enter the 6-digit code sent to ${email}`}
          </CyberText>
        </View>

        {step === 0 ? (
            <View style={styles.form}>
                <Input
                    label="Display Name"
                    placeholder="Neo"
                    value={name}
                    onChangeText={setName}
                    icon={<User size={20} color={Colors.dark.icon} />}
                />

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

                <Input
                    label="Confirm Password"
                    placeholder="********"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    icon={<Lock size={20} color={Colors.dark.icon} />}
                />

                <Button 
                    title="Verify Email & Register" 
                    onPress={handleVerifyEmail} 
                    loading={loading}
                    style={{ marginTop: 20 }}
                />
            </View>
        ) : (
            <View style={styles.form}>
                <View style={styles.otpContainer}>
                    <CheckCircle size={40} color={Colors.dark.primary} style={{marginBottom: 20}} />
                    <Input
                        label="Verification Code"
                        placeholder="123456"
                        value={userOtp}
                        onChangeText={setUserOtp}
                        keyboardType="numeric"
                        maxLength={6}
                        style={{ textAlign: 'center', fontSize: 24, letterSpacing: 5 }}
                        containerStyle={{ width: '80%' }}
                    />
                </View>

                <Button 
                    title="Confirm Code" 
                    onPress={handleRegister} 
                    loading={loading}
                    variant="success"
                    style={{ marginTop: 20 }}
                />
                 <TouchableOpacity onPress={() => handleVerifyEmail()} disabled={loading}>
                    <CyberText variant="caption" style={{alignSelf: 'center', marginTop: 20, color: Colors.dark.primary}}>
                        Resend Code
                    </CyberText>
                </TouchableOpacity>
            </View>
        )}

        <View style={styles.footer}>
          <CyberText variant="caption">Already have an account? </CyberText>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <CyberText variant="caption" color={Colors.dark.primary} style={{ fontWeight: 'bold' }}>Login</CyberText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1, 
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 5,
  },
  form: {
    marginBottom: 20,
    flex: 1,
  },
  otpContainer: {
      alignItems: 'center',
      marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  }
});
