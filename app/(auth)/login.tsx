import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import api from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState(''); // start empty
  const [password, setPassword] = useState(''); // start empty
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/login', { email, password });
      const token = res.data.token;

      if (!token) {
        Alert.alert('Error', 'Login failed: token not received');
        return;
      }

      await signIn(token);
      router.replace('/(app)/todos'); // go to dashboard
    } catch (err: any) {
      console.error(err.response?.data || err);
      const message = err.response?.data?.message || 'Login failed';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        keyboardType='email-address'
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />

      <Button
        title={loading ? 'Signing in...' : 'Sign in'}
        onPress={handleLogin}
      />

      <Button
        title="Register"
        onPress={() => router.push('/(auth)/register')}
      />
    </View>
  );
}
