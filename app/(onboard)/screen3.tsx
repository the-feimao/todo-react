import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardScreen3() {
	const router = useRouter();
	return (
		<View style={{flex:1,justifyContent:'center',alignItems:'center',padding:16}}>
			<Text style={{fontSize:20,marginBottom:12}}>All set — Screen 3</Text>
			<Button title="Get Started" onPress={() => router.replace('/(auth)/login')} />
		</View>
	);
}
