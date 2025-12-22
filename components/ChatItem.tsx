import { Colors } from '@/constants/Colors';
import { ChatService } from '@/services/chat';
import { Href, useRouter } from 'expo-router';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CyberText } from './StyledText';
import { useToast } from './Toast';

interface ChatItemProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
  onDelete?: (id: string, name: string) => void;
}

export function ChatItem({ id, name, lastMessage, time, unread = 0, online = false, onDelete }: ChatItemProps) {
  const router = useRouter();
  const { show } = useToast();
  
  const handleDelete = () => {
    onDelete?.(id, name);
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => router.push(`/chat/${id}?name=${name}` as Href)}
      onLongPress={handleDelete}
      // @ts-ignore
      onContextMenu={(e) => {
          if (Platform.OS === 'web') {
              e.preventDefault();
              handleDelete();
          }
      }}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
         <View style={[styles.avatar, { backgroundColor: Colors.dark.surfaceHighlight }]}>
            <CyberText variant="h2" style={{color: Colors.dark.text}}>{name[0]}</CyberText>
         </View>
         {online && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <CyberText variant="body" style={styles.name}>{name}</CyberText>
          <CyberText variant="caption" style={styles.time}>{time}</CyberText>
        </View>
        
        <View style={styles.footer}>
          <CyberText variant="caption" numberOfLines={1} style={styles.message}>
            {lastMessage}
          </CyberText>
          {unread > 0 && (
            <View style={styles.badge}>
              <CyberText variant="caption" style={styles.badgeText}>{unread}</CyberText>
            </View>
          )}
        </View>
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
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.success,
    borderWidth: 2,
    borderColor: Colors.dark.background,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  time: {
    color: Colors.dark.icon,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    color: Colors.dark.icon,
    flex: 1,
    marginRight: 10,
  },
  badge: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 10,
  }
});
