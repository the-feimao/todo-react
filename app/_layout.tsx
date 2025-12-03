import { Slot } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../lib/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider style={{ flex: 1,paddingTop:50 }}>
      <Slot />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
