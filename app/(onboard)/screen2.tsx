import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardScreen2() {
	const router = useRouter();
	return (
		<View style={{flex:1,justifyContent:'center',alignItems:'center',padding:16}}>
			<Text style={{fontSize:20,marginBottom:12}}>Onboarding — Screen 2</Text>
			<Button title="Next" onPress={() => router.push('/(onboard)/screen3')} />
		</View>
	);
}
