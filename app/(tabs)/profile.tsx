import { CyberAlert } from '@/components/CyberAlert';
import { CyberCard } from '@/components/CyberCard';
import { Button } from '@/components/Button';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/auth';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Camera, Shield } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useToast } from '@/components/Toast';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const toast = useToast();
  
  // Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<any>({
      title: '',
      message: '',
      type: 'warning',
      onConfirm: () => {},
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleUpdateAvatar = async () => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true, // Enable base64 for Web CORS fix
        });

        if (!result.canceled && result.assets[0].uri) {
            console.log("Picking Image:", result.assets[0].uri);
            toast.show('Uploading...', 'info');
            
            // Pass base64 data if available
            const newPhotoURL = await AuthService.updateProfilePicture(
                result.assets[0].uri, 
                result.assets[0].base64
            );
            console.log("New Photo URL:", newPhotoURL);
            
            if (newPhotoURL) {
                // Force update state with new URL
                setUser((prevUser: any) => ({ ...prevUser, photoURL: newPhotoURL }));
                toast.show('Profile picture updated!', 'success');
            } else {
                console.error("New Photo URL is empty/null");
                toast.show('Failed to get photo URL', 'error');
            }
        }
    } catch (error) {
        console.error(error);
        toast.show('Failed to update profile picture', 'error');
    }
  };

  const handleLogout = () => {
      setAlertConfig({
          title: 'Logout',
          message: 'Are you sure you want to terminate this session?',
          type: 'error',
          confirmText: 'Logout',
          onConfirm: async () => {
              setAlertVisible(false);
              await AuthService.logout();
              router.replace('/auth/login');
          }
      });
      setAlertVisible(true);
  };

  const handleRegenerateKeys = () => {
      setAlertConfig({
          title: 'Regenerate Keys',
          message: 'This will invalidate current sessions. You will need to re-exchange keys with contacts.',
          type: 'warning',
          confirmText: 'Regenerate',
          onConfirm: () => {
              setAlertVisible(false);
              toast.show('Keys Regenerated', 'success');
          }
      });
      setAlertVisible(true);
  };

  const handleClearStorage = () => {
      setAlertConfig({
          title: 'Clear Secure Storage',
          message: 'This will wipe all local encrypted data. This action cannot be undone.',
          type: 'error',
          confirmText: 'Wipe Data',
          onConfirm: () => {
              setAlertVisible(false);
              toast.show('Secure storage wiped', 'info');
          }
      });
      setAlertVisible(true);
  };

  return (
    <ScreenWrapper style={styles.container}>
      <CyberAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertVisible(false)}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <CyberCard variant="glowing" style={styles.card}>
            <View style={styles.header}>
            <TouchableOpacity onPress={handleUpdateAvatar} style={styles.avatarContainer}>
                {user?.photoURL ? (
                    <Image 
                        source={{ uri: user.photoURL }} 
                        style={styles.avatarImage} 
                        cachePolicy="none"
                        onError={(e) => console.error("Image Load Error:", e)}
                        onLoad={() => console.log("Image Loaded Success:", user.photoURL)}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <CyberText variant="h1">{user?.displayName?.[0] || '?'}</CyberText>
                    </View>
                )}
                <View style={styles.editIcon}>
                    <Camera size={16} color="#fff" />
                </View>
            </TouchableOpacity>
            
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
                    onPress={handleClearStorage}
                    style={styles.button}
                />

                <Button
                    title="Logout"
                    variant="danger"
                    onPress={handleLogout}
                    style={[styles.button, { marginTop: 20 }]}
                />
            </View>
        </CyberCard>
        
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
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 20,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  editIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: Colors.dark.accent,
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#000',
  },
  name: {
    marginBottom: 5,
    textAlign: 'center',
  },
  email: {
    color: Colors.dark.icon,
    marginBottom: 10,
    textAlign: 'center',
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
    width: '100%',
  },
  sectionTitle: {
    marginBottom: 10,
    color: Colors.dark.icon,
    marginLeft: 4,
  },
  button: {
    marginBottom: 10,
  },
  about: {
    alignItems: 'center',
    marginTop: 20,
  }
});
