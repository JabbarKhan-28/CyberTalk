import { Button } from '@/components/Button';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/auth';
import { useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
          await AuthService.logout();
          router.replace('/auth/login');
      }}
    ]);
  };

  const handleRegenerateKeys = () => {
    Alert.alert(
        'Warning', 
        'Regenerating DH keys will invalidate current sessions. You will need to re-exchange keys with contacts.',
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Regenerate', style: 'destructive' }
        ]
    );
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
           <View style={styles.avatar}>
               <CyberText variant="h1">{user?.displayName?.[0] || '?'}</CyberText>
           </View>
           <CyberText variant="h2" style={styles.name}>{user?.displayName || 'User'}</CyberText>
           <CyberText variant="body" style={styles.email}>{user?.email || 'No Email'}</CyberText>
           
           <View style={styles.badge}>
                <Shield size={14} color="#000" />
                <CyberText variant="caption" style={styles.badgeText}>SECURE ID Verified</CyberText>
           </View>
        </View>

        <View style={styles.section}>
            <CyberText variant="label" style={styles.sectionTitle}>ACCOUNT</CyberText>
            
            <Button
                title="Security Settings"
                variant="outline"
                onPress={() => router.push('/settings/security')}
                style={styles.button}
            />
        </View>

        <View style={styles.section}>
            <CyberText variant="label" style={styles.sectionTitle}>DANGER ZONE</CyberText>
            
            <Button
                title="Regenerate My Keys"
                variant="secondary"
                onPress={handleRegenerateKeys}
                style={styles.button}
            />

            <Button
                title="Clear Secure Storage"
                variant="secondary"
                onPress={() => Alert.alert('Cleared', 'Secure storage wiped.')}
                style={styles.button}
            />

            <Button
                title="Logout"
                variant="danger"
                onPress={handleLogout}
                style={[styles.button, { marginTop: 20 }]}
            />
        </View>
        
        <View style={styles.about}>
            <CyberText variant="caption">CyberTalk v1.0.0</CyberText>
            <CyberText variant="caption">Built with Expo & React Native</CyberText>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  name: {
    marginBottom: 5,
  },
  email: {
    color: Colors.dark.icon,
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.success,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 10,
    color: Colors.dark.icon,
  },
  button: {
    marginBottom: 10,
  },
  about: {
    alignItems: 'center',
    marginTop: 20,
  }
});
