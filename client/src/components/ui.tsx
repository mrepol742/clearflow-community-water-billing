import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { PropsWithChildren, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { useApp } from '@/context/app-context';

type IconName = SymbolViewProps['name'];

export function Icon({
  name,
  size = 20,
  color,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  const { colors } = useApp();
  return <SymbolView name={name} size={size} tintColor={color ?? colors.text} />;
}

export function AppText({
  children,
  muted,
  weight = '500',
  size = 15,
  style,
  numberOfLines,
}: PropsWithChildren<{
  muted?: boolean;
  weight?: '400' | '500' | '600' | '700' | '800';
  size?: number;
  style?: StyleProp<any>;
  numberOfLines?: number;
}>) {
  const { colors } = useApp();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.text,
        { color: muted ? colors.textMuted : colors.text, fontSize: size, fontWeight: weight },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function Field({
  label,
  icon,
  error,
  style,
  ...props
}: Omit<TextInputProps, 'style'> & {
  label: string;
  icon?: IconName;
  error?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useApp();
  return (
    <View style={[styles.fieldWrap, style]}>
      <AppText size={13} weight="600">
        {label}
      </AppText>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: colors.surface, borderColor: error ? colors.danger : colors.border },
        ]}>
        {icon ? <Icon name={icon} size={18} color={colors.textMuted} /> : null}
        <TextInput
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          style={[styles.input, { color: colors.text }]}
          {...props}
        />
      </View>
      {error ? (
        <AppText size={12} style={{ color: colors.danger }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

export function Button({
  label,
  icon,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: {
  label: string;
  icon?: IconName;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useApp();
  const palette = {
    primary: { bg: colors.primary, fg: colors.white, border: colors.primary },
    secondary: { bg: colors.surfaceAlt, fg: colors.text, border: colors.border },
    danger: { bg: colors.dangerSoft, fg: colors.danger, border: colors.dangerSoft },
    ghost: { bg: 'transparent', fg: colors.textMuted, border: 'transparent' },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.bg, borderColor: palette.border },
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.fg} size="small" />
      ) : (
        <>
          {icon ? <Icon name={icon} size={18} color={palette.fg} /> : null}
          <Text style={[styles.buttonText, { color: palette.fg }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const { colors } = useApp();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow },
        style,
      ]}>
      {children}
    </View>
  );
}

export function Badge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'primary';
}) {
  const { colors } = useApp();
  const palette = {
    neutral: [colors.surfaceAlt, colors.textMuted],
    success: [colors.successSoft, colors.success],
    warning: [colors.warningSoft, colors.warning],
    danger: [colors.dangerSoft, colors.danger],
    primary: [colors.primarySoft, colors.primary],
  }[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette[0] }]}>
      <Text style={[styles.badgeText, { color: palette[1] }]}>{label}</Text>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  const { colors } = useApp();
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceAlt }]}>
        <Icon name={icon} size={28} color={colors.primary} />
      </View>
      <AppText weight="700" size={17}>
        {title}
      </AppText>
      <AppText muted style={styles.emptyBody}>
        {body}
      </AppText>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { lineHeight: 21 },
  fieldWrap: { gap: 7, flexGrow: 1, minWidth: 180 },
  inputWrap: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 11, minWidth: 0 },
  button: {
    height: 46,
    borderRadius: 7,
    borderWidth: 1,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: { fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.48 },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  empty: { alignItems: 'center', paddingVertical: 44, paddingHorizontal: 24, gap: 8 },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyBody: { textAlign: 'center', maxWidth: 360 },
});
