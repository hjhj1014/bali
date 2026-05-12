import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#F5ECD7" />
        {/* On web: centre the app at phone-width so it looks like a mobile app
            regardless of desktop screen width. On native: full screen. */}
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const WEB_MAX_WIDTH = 430;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // Warm sand tone fills the sides on wide desktop screens
    backgroundColor: Platform.OS === 'web' ? '#C4B49C' : '#F5ECD7',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5ECD7',
    // Web: centre the phone-width column; native: fill the screen
    ...(Platform.OS === 'web'
      ? {
          maxWidth: WEB_MAX_WIDTH,
          width: '100%' as any,
          alignSelf: 'center' as const,
        }
      : {}),
  },
});
