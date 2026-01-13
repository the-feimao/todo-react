import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';


export default function Onboard() {
  const router = useRouter();

  return (
    <View className='flex-1 justify-between p-5 bg-yellow-500 h'>
       <Text className='text-2xl font-extrabold text-center mt-12 '>Welcome to TodoApp</Text>
      <View className='flex-1 items-center justify-center'>

        <View className='items-center justify-center mb-48 px-4'>
            <Image
          source={require('../../assets/images/planning-list.png')}
          className="w-[300px] h-[300px] px-4 mb-6"
          resizeMode="contain"
      
          
        />
           <Text>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse, labore. Et porro, illum officiis excepturi quo dolorem atque, culpa architecto, iure eos laboriosam. Nam modi, fuga necessitatibus aliquid praesentium quaerat.
        </Text>
        </View>
     
       
      
      
        <View className='mb-24'>
          <Button
          title="Get started"
          onPress={() => router.replace('/(onboard)/screen1')}
        
        />
        </View>
        
      </View>

      <View >
        <Button
          title="Skip"
          color="#999"
          onPress={() => router.replace('/(auth)/login')}
        />
      </View>
    </View>
  );
}


