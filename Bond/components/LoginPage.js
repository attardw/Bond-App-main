import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert, Image } from 'react-native';

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Attempt to login
    try {
      const response = await fetch('http://EXAMPLEIP/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const json = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Login Successful');
        navigation.navigate('MainInterface', { token: json.token });
      } else {
        Alert.alert('Login Failed', json.data || 'Invalid Credentials');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Unable to connect to the server');
    }
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={require('../Bond pics/BondLogo.jpg')}
        style={styles.logo}
      />
      <Text style={styles.title}>Log In</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

       {/* Forgot Password Link */}
       <Text style={styles.forgotPassword} onPress={() => Alert.alert('Redirect', 'Forgot Password Clicked')}>
        Forgot password?
      </Text>

       {/* Division with "OR" Text */}
       <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Create New Account Button */}
      <TouchableOpacity style={styles.newAccountButton} onPress={() => navigation.navigate('register')}>
        <Text style={styles.newAccountButtonText}>Create new account</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  logo: {
    width: 150, // Adjusted width to a more appropriate size
    height: 100, // Adjusted height to match the new width
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#000',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0FC1DF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  forgotPassword: {
    color: '#0FC1DF',
    marginTop: 15,
    marginBottom: 10,
  },
  newAccountButton: {
    backgroundColor: '#FF8F49',
    padding: 10,
    borderRadius: 5,
  },
  newAccountButtonText: {
    color: '#fff',
  },
});

export default LoginPage;
