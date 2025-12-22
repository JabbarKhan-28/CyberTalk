import { ChatService } from '@/services/chat';
import { Colors } from '@/constants/Colors';
import { Href, useRouter } from 'expo-router';
import { ShieldAlert, ShieldCheck } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CyberText } from './StyledText';

interface ContactItemProps {
  id: string;
  name: string;
  email: string;
  hasKeys: boolean;
}

export function ContactItem({ id, name, email, hasKeys }: ContactItemProps) {
  const router = useRouter();

  const handlePress = async () => {
    if (hasKeys) {
      try {
        const chatId = await ChatService.createChat(id);
        router.push(`/chat/${chatId}?name=${name}` as Href);
      } catch (error) {
        console.error("Failed to open chat", error);
      }
    } else {
      router.push({ pathname: '/keys/exchange', params: { userId: id, name } } as Href);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
       <View style={[styles.avatar, { backgroundColor: hasKeys ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 0, 85, 0.1)' }]}>
          <CyberText variant="h2" style={{color: hasKeys ? Colors.dark.success : Colors.dark.error}}>
            {name[0]}
          </CyberText>
       </View>

       <View style={styles.content}>
         <CyberText variant="body" style={styles.name}>{name}</CyberText>
         <CyberText variant="caption">{email}</CyberText>
       </View>

       <View style={styles.status}>
         {hasKeys ? (
           <ShieldCheck size={20} color={Colors.dark.success} />
         ) : (
           <ShieldAlert size={20} color={Colors.dark.warning} />
         )}
         <CyberText variant="caption" style={{ color: hasKeys ? Colors.dark.success : Colors.dark.warning, marginTop: 4 }}>
           {hasKeys ? 'SECURE' : 'UNVERIFIED'}
         </CyberText>
       </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  status: {
    alignItems: 'center',
  }
});
