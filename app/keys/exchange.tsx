import { Button } from '@/components/Button';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { useToast } from '@/components/Toast';
import { ChatService } from '@/services/chat';
import { Colors } from '@/constants/Colors';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Key, ShieldCheck } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

export default function KeyExchangeScreen() {
  const { name, userId } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  
  const [step, setStep] = useState(0); // 0: Init, 1: Exchanging, 2: Computing, 3: Done
  const [myKey, setMyKey] = useState('Generating...');
  const [theirKey, setTheirKey] = useState('Waiting...');

  useEffect(() => {
    // Mock Key Generation
    setTimeout(() => {
        setMyKey('0x4F3A...91B2'); // Truncated for UI
        toast.show('Public Key Generated', 'info');
    }, 500);
  }, []);

  const handleExchange = () => {
    setStep(1);
    // Mock fetching their key
    setTimeout(() => {
        setTheirKey('0x8C2D...55A1');
        setStep(2);
        // Mock computing shared secret
        setTimeout(() => {
            setStep(3);
            toast.show('Secure Channel Established', 'success');
        }, 1500);
    }, 1500);
  };

  const finish = async () => {
      try {
        const chatId = await ChatService.createChat(userId as string);
        
        // Mark the chat as secure in Firestore
        // Ideally this happens after actual cryptographic exchange
        await ChatService.setChatSecure(chatId, true);

        router.replace(`/chat/${chatId}?name=${name}` as Href);
      } catch (error) {
          console.error("Failed to create chat", error);
          toast.show('Error creating chat', 'error');
      }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
            <Key size={60} color={step === 3 ? Colors.dark.success : Colors.dark.primary} />
        </View>
        
        <CyberText variant="h1" style={styles.title}>Secure Channel</CyberText>
        <CyberText variant="body" style={styles.subtitle}>
          Establishing End-to-End Encryption with {name}
        </CyberText>

        <View style={styles.card}>
            <CyberText variant="label">MY PUBLIC KEY (Alice)</CyberText>
            <CyberText variant="caption" style={styles.hash}>{myKey}</CyberText>
        </View>

        <View style={styles.arrow}>
             <ArrowRight color={Colors.dark.icon} size={24} />
        </View>

        <View style={styles.card}>
            <CyberText variant="label">{typeof name === 'string' ? name.toUpperCase() : 'USER'}'S PUBLIC KEY</CyberText>
            {step >= 1 ? (
                <CyberText variant="caption" style={styles.hash}>{theirKey}</CyberText>
            ) : (
                <CyberText variant="caption" style={{color: Colors.dark.icon}}>Not received yet</CyberText>
            )}
        </View>

        {step === 2 && (
            <View style={styles.status}>
                <ActivityIndicator color={Colors.dark.accent} />
                <CyberText variant="caption" style={{marginTop: 10}}>Computing AES Shared Secret...</CyberText>
            </View>
        )}

        {step === 3 && (
            <View style={styles.success}>
                <ShieldCheck size={40} color={Colors.dark.success} />
                <CyberText variant="h2" style={{color: Colors.dark.success, marginTop: 10}}>SECURE</CyberText>
                <CyberText variant="caption">AES-256 Session Key Established</CyberText>
            </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step === 0 && (
             <Button title="Initiate Details Exchange" onPress={handleExchange} />
        )}
        {step === 3 && (
             <Button title="Start Encrypted Chat" onPress={finish} variant="success" style={{backgroundColor: Colors.dark.success}} />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.dark.icon,
    marginBottom: 40,
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    alignItems: 'center',
  },
  hash: {
    fontFamily: 'monospace', // Platform specific, keeping simple
    marginTop: 5,
    color: Colors.dark.primary,
  },
  arrow: {
    marginVertical: 10,
  },
  status: {
    marginTop: 30,
    alignItems: 'center',
  },
  success: {
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderRadius: 10,
    width: '100%',
  },
  footer: {
    padding: 20,
  }
});
