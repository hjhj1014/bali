import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation';
import { LanguageProvider } from './src/context/LanguageContext';
import { LanguageSwitcher } from './src/components/LanguageSwitcher';

export default function App() {
  return (
    <LanguageProvider>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <StatusBar style="dark" backgroundColor="#F5ECD7" />
          <View style={styles.container}>
            <AppNavigator />
            {/* Global floating language switcher — top-right */}
            <View style={styles.langOverlay} pointerEvents="box-none">
              <LanguageSwitcher />
            </View>
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </LanguageProvider>
  );
}

const WEB_MAX_WIDTH = 430;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#C4B49C' : '#F5ECD7',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5ECD7',
    ...(Platform.OS === 'web'
      ? {
          maxWidth: WEB_MAX_WIDTH,
          width: '100%' as any,
          alignSelf: 'center' as const,
        }
      : {}),
  },
  langOverlay: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 10 : 48,
    right: 10,
    zIndex: 9999,
  },
});
