import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type Nav = StackNavigationProp<RootStackParamList>;

// 임시 관리자 비밀번호 (MVP용 — 나중에 Supabase Auth로 교체 권장)
const ADMIN_PASSWORD = '1234';

export function AdminLoginScreen() {
  const navigation = useNavigation<Nav>();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      navigation.navigate('AdminHome');
    } else {
      Alert.alert('로그인 실패', '비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <View style={styles.iconWrap}>
          <Ionicons name="lock-closed" size={32} color={colors.terracotta} />
        </View>
        <Text style={styles.title}>관리자 로그인</Text>
        <Text style={styles.subtitle}>Bali Mom & Kid Stay 관리자 페이지</Text>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 입력"
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={login}
            returnKeyType="done"
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    marginBottom: spacing.xl,
  },
  inputWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: colors.text,
  },
  eyeBtn: {
    padding: spacing.sm,
  },
  loginButton: {
    width: '100%',
    height: 52,
    backgroundColor: colors.terracotta,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
