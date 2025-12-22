import { Colors } from '@/constants/Colors';
import React from 'react';
import { Platform, Text, TextProps } from 'react-native';

interface CyberTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'body' | 'caption' | 'label';
  color?: string;
  glow?: boolean;
}

export function CyberText({ style, variant = 'body', color = Colors.dark.text, glow = false, ...otherProps }: CyberTextProps): React.JSX.Element {
  let fontSize = 16;
  let fontWeight: any = '400';
  let letterSpacing = 0.5;

  switch (variant) {
    case 'h1':
      fontSize = 34;
      fontWeight = '700';
      letterSpacing = 1;
      break;
    case 'h2':
      fontSize = 22;
      fontWeight = '600';
      letterSpacing = 0.5;
      break;
    case 'label':
      fontSize = 13;
      fontWeight = '600';
      letterSpacing = 1;
      color = Colors.dark.primaryHighlight;
      break;
    case 'caption':
      fontSize = 12;
      color = Colors.dark.icon;
      letterSpacing = 0.2;
      break;
  }

  const glowStyle = glow ? Platform.select({
    web: {
      textShadow: `0px 0px 15px ${Colors.dark.primary}`,
    },
    default: {
      textShadowColor: Colors.dark.primary, // Use primary for glow defaults
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 15, // Softer glow
    }
  }) : {};

  return <Text style={[{ color, fontSize, fontWeight, letterSpacing }, glowStyle, style]} {...otherProps} />;
}
