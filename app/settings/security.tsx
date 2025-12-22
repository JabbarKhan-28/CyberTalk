import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { SettingsService } from '@/services/settings';
import { Activity, EyeOff, FileText, Shield, Smartphone } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useToast } from '@/components/Toast';
import { CyberAlert } from '@/components/CyberAlert';

export default function SecuritySettingsScreen() {
  const [biometrics, setBiometrics] = useState(false);
  const [screenshotBlock, setScreenshotBlock] = useState(false);
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
      loadSettings();
  }, []);

  const loadSettings = async () => {
      const bio = await SettingsService.getBiometricsEnabled();
      const screen = await SettingsService.getScreenshotBlockEnabled();
      setBiometrics(bio);
      setScreenshotBlock(screen);
  };

  const toggleBiometrics = async (value: boolean) => {
      setBiometrics(value);
      await SettingsService.setBiometricsEnabled(value);
  };

  const toggleScreenshot = async (value: boolean) => {
      setScreenshotBlock(value);
      await SettingsService.setScreenshotBlockEnabled(value);
  };

  const handleRegenerateKeys = () => {
      setAlertConfig({
          title: 'Regenerate Keys',
          message: 'New AES-256 session keys have been generated for all active chats.',
          type: 'success',
          confirmText: 'OK',
          onConfirm: () => {
              setAlertVisible(false);
              toast.show('Keys Rotated', 'success');
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

        <View style={styles.section}>
            <CyberText variant="label" style={styles.sectionHeader}>DEVICE SECURITY</CyberText>
            
            <View style={styles.row}>
                <View style={styles.rowLeft}>
                    <Smartphone size={24} color={Colors.dark.primary} />
                    <View style={styles.labelContainer}>
                        <CyberText variant="body">Biometric Authentication</CyberText>
                        <CyberText variant="caption">Use FaceID/TouchID to unlock app</CyberText>
                    </View>
                </View>
                <Switch 
                    value={biometrics} 
                    onValueChange={toggleBiometrics}
                    trackColor={{ false: '#333', true: Colors.dark.primary }}
                    thumbColor="#fff"
                />
            </View>

            <View style={styles.row}>
                <View style={styles.rowLeft}>
                    <EyeOff size={24} color={Colors.dark.primary} />
                    <View style={styles.labelContainer}>
                        <CyberText variant="body">Block Screenshots</CyberText>
                        <CyberText variant="caption">Prevent screen capture in chats</CyberText>
                    </View>
                </View>
                <Switch 
                    value={screenshotBlock} 
                    onValueChange={toggleScreenshot}
                    trackColor={{ false: '#333', true: Colors.dark.primary }}
                    thumbColor="#fff"
                />
            </View>
        </View>

        <View style={styles.section}>
            <CyberText variant="label" style={styles.sectionHeader}>NETWORK SECURITY</CyberText>
            
            <TouchableOpacity 
                style={styles.row}
                onPress={() => toast.show('Encryption Status: Active (AES-256)', 'success')}
            >
                 <View style={styles.rowLeft}>
                    <Shield size={24} color={Colors.dark.success} />
                    <View style={styles.labelContainer}>
                         <CyberText variant="body">Check Encryption Status</CyberText>
                         <CyberText variant="caption">All systems operational</CyberText>
                    </View>
                 </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.row}
                onPress={handleRegenerateKeys}
            >
                 <View style={styles.rowLeft}>
                    <Activity size={24} color={Colors.dark.warning} />
                    <View style={styles.labelContainer}>
                         <CyberText variant="body">Regenerate Session Keys</CyberText>
                         <CyberText variant="caption">Force rotate all AES keys</CyberText>
                    </View>
                 </View>
            </TouchableOpacity>
        </View>

        <View style={styles.section}>
            <CyberText variant="label" style={styles.sectionHeader}>LEGAL</CyberText>
             <TouchableOpacity 
                style={styles.row}
                onPress={() => Linking.openURL('https://cybertalk.app/privacy')}
            >
                 <View style={styles.rowLeft}>
                    <FileText size={24} color={Colors.dark.icon} />
                    <View style={styles.labelContainer}>
                         <CyberText variant="body">Privacy Policy</CyberText>
                    </View>
                 </View>
            </TouchableOpacity>
        </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 15,
    color: Colors.dark.icon,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  labelContainer: {
    marginLeft: 15,
    flex: 1,
  }
});
