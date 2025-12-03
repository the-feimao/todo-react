import React, {useState} from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import api from '../../lib/api';
import { useRouter } from 'expo-router';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation, // Laravel expects this
      });
      Alert.alert('Success', 'Registration successful!');
      router.replace('/(auth)/login');
    } catch (err: any) {
      console.error(err.response?.data || err);
      const message = err.response?.data?.message || 'Registration failed';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={{flex:1, justifyContent:'center', padding:16}}>
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} style={{borderWidth:1, padding:8, marginBottom:12}} />

      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize='none' style={{borderWidth:1, padding:8, marginBottom:12}} />

      <Text>Password</Text>
      <TextInput value={password} secureTextEntry onChangeText={setPassword} style={{borderWidth:1, padding:8, marginBottom:12}} />

      <Text>Confirm Password</Text>
      <TextInput value={passwordConfirmation} secureTextEntry onChangeText={setPasswordConfirmation} style={{borderWidth:1, padding:8, marginBottom:12}} />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
