import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Button1 from '@/components/ui/Button1';


export default function Onboard() {
  const router = useRouter();

  return (
    <View className='flex-1   bg-yellow-500  pt-safe-offset-32'>
       <Text className='text-3xl font-bold text-center text-white '  
       style={{
       textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
        }}
       >Welcome to TodoApp</Text>
      <View className='flex-1 items-center justify-center bg-white mt-64 rounded-t-full'>

        <View className='items-center justify-center fixed  px-6 -top-52 '>
            <Image
          source={require('../../assets/images/planning-list.png')}
          className="w-[300px] h-[300px]"
          resizeMode="contain"
      
          
        />
           <Text className='text-center px-16 text-gray-700'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse, labore. 
        </Text>
        </View>
     
       
      
      
        <View className='-top-36'>
          <Button1 />
        
        </View>

        <View className='-top-12' >
          <Button
            title="Skip"
            color="#999"
            onPress={() => router.replace('/(auth)/login')}
          />
        </View>
        
      </View>

     
    </View>
  );
}


