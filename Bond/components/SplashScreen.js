import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
function SplashScreen({ navigation }) {
  useEffect(() => {
  
    const playSound = async () => {
    
      const { sound } = await Audio.Sound.createAsync(
        require('../BondSounds/BondSound.mp3')
      );

      await sound.playAsync();

      setTimeout(() => {
    
        sound.unloadAsync();
        navigation.replace('LoginPage');
      }, 3000); 
    };

    playSound();

    return () => {
    
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../Bond pics/BondLogo.jpg")}
        style={styles.logo} 
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 700, 
    height: 700,
    resizeMode: 'contain'
  },
});

export default SplashScreen;

