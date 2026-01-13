import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardScreen1() {
	const router = useRouter();
	return (
		<View style={{flex:1,justifyContent:'center',alignItems:'center',padding:16}}>
			<Text className='text-xl font-bold text-blue-500'>Welcome — Screen 1</Text>
			<Button title="Next" onPress={() => router.push('/(onboard)/screen2')} />
                
		</View>
	);
}
