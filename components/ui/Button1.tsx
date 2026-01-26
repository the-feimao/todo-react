import { router } from 'expo-router'
import React from 'react'
import { Button, Pressable, Text, View } from 'react-native'

function Button1() {
  return (
      <View className='bg-yellow-500 rounded-full px-32 py-3'>
                        <Pressable
                onPress={() => router.replace('/(onboard)/screen1')}
                className="items-center"
            >
                <Text className="text-white font-extrabold text-lg tracking-wide">
                Get started
                </Text>
            </Pressable>
              </View>
  )
}

export default Button1