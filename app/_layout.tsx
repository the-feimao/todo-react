import { Slot } from 'expo-router';
import "../global.css";
import React from 'react';
import { AuthProvider } from '../lib/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider style={{ flex: 1 }}>
      <Slot />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
