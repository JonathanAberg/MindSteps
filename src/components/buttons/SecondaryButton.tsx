import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface Props {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

export const SecondaryButton: React.FC<Props> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, styles.secondary, disabled && styles.disabled, style]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondary: { backgroundColor: '#DEE8FC' },
  disabled: { opacity: 0.55 },
  text: { color: '#304A76', fontWeight: '600', fontSize: 15 },
});

export default SecondaryButton;
