import { Colors } from '@/constants/Colors';
import { Platform, StyleSheet, View } from 'react-native';
import { CyberText } from './StyledText';

interface MessageBubbleProps {
  text: string;
  isMe: boolean;
  timestamp: string;
}

export function MessageBubble({ text, isMe, timestamp }: MessageBubbleProps) {
  return (
    <View style={[
      styles.container,
      isMe ? styles.meContainer : styles.otherContainer
    ]}>
      <View style={[
        styles.bubble,
        isMe ? styles.meBubble : styles.otherBubble
      ]}>
        <CyberText variant="body" style={{ color: isMe ? '#000' : Colors.dark.text }}>
          {text}
        </CyberText>
      </View>
      <CyberText variant="caption" style={styles.time}>{timestamp}</CyberText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  meContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: '100%',
  },
  meBubble: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primaryHighlight,
    borderBottomRightRadius: 4,
    ...Platform.select({
      web: {
        boxShadow: `0px 2px 4px ${Colors.dark.primary}`,
      },
      default: {
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  otherBubble: {
    backgroundColor: Colors.dark.surfaceHighlight,
    borderColor: Colors.dark.border,
    borderBottomLeftRadius: 4,
  },
  time: {
    marginTop: 4,
    opacity: 0.7,
    fontSize: 10,
    marginHorizontal: 4,
  }
});
