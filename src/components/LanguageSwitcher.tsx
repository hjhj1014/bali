import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { Lang } from '../i18n/translations';

const FLAGS: { lang: Lang; flag: string }[] = [
  { lang: 'ko', flag: '🇰🇷' },
  { lang: 'en', flag: '🇺🇸' },
  { lang: 'id', flag: '🇮🇩' },
  { lang: 'uk', flag: '🇺🇦' },
  { lang: 'es', flag: '🇨🇴' },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <View style={styles.pill}>
      {FLAGS.map(({ lang: l, flag }) => (
        <TouchableOpacity
          key={l}
          style={[styles.btn, lang === l && styles.btnActive]}
          onPress={() => setLang(l)}
          activeOpacity={0.75}
        >
          <Text style={styles.flag}>{flag}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    gap: 1,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 22,
    padding: 2,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  btn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  flag: {
    fontSize: 15,
    lineHeight: 20,
  },
});
