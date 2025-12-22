import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { Activity, EyeOff, FileText, Shield, Smartphone } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

export default function SecuritySettingsScreen() {
  const [biometrics, setBiometrics] = useState(true);
  const [screenshotBlock, setScreenshotBlock] = useState(false);

  return (
    <ScreenWrapper style={styles.container}>
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
                    onValueChange={setBiometrics}
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
                    onValueChange={setScreenshotBlock}
                    trackColor={{ false: '#333', true: Colors.dark.primary }}
                    thumbColor="#fff"
                />
            </View>
        </View>

        <View style={styles.section}>
            <CyberText variant="label" style={styles.sectionHeader}>NETWORK SECURITY</CyberText>
            
            <TouchableOpacity style={styles.row}>
                 <View style={styles.rowLeft}>
                    <Shield size={24} color={Colors.dark.success} />
                    <View style={styles.labelContainer}>
                         <CyberText variant="body">Check Encryption Status</CyberText>
                         <CyberText variant="caption">All systems operational</CyberText>
                    </View>
                 </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
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
             <TouchableOpacity style={styles.row}>
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
