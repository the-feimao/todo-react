import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Onboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to TodoApp</Text>
        <Text style={styles.subtitle}>Short onboarding slide 1</Text>
        {/* For real app use react-native-pager or flatlist */}
        <Button
          title="Get started"
          onPress={() => router.replace('/(onboard)/screen1')}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Skip"
          color="#999"
          onPress={() => router.replace('/(auth)/login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#555',
  },
  footer: {
    marginBottom: 20,
    alignItems: 'center',
  },
});
