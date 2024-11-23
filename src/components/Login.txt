import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');

  const navigation = useNavigation();

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input and validation
  const handleEmailChange = (text) => {
    setEmail(text);
    if (!text) {
      setEmailError('Email is required');
    } else if (!validateEmail(text)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  // Handle password input and validation
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password is required');
    } else if (text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError(''); 
    }
  };

  // Handle login submission
  const onLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
  
    // Check if email and password are valid before submitting
    if (!email) {
      setEmailError('Email is required');
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
    }
  
    if (!password) {
      setPasswordError('Password is required');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    }
  
    // Only proceed if both fields are valid and no error
    if (!emailError && !passwordError && email && password) {
      try {
        const response = await axios.post('http://192.168.0.167:3003/auth/login', { email, password });
        // console.log(response.data);
        if (response.status === 200) {
          setMessage(response.data.message || 'Login successful');
  
          if (response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
            navigation.navigate('UserDrawer', { screen: 'Dashboard' });
          }
        } 
        
        if (response.status === 500) {
          const { error } = response.data;

        }
      } catch (err) {
        // console.error(err.response.data);
        let {password, user} = err.response.data.error;
        if (user) {
          Alert.alert('Error',user, [{ text: 'OK' }]);
        }
        if (password) {
          Alert.alert('Error',password, [{ text: 'OK' }]);
        }
      }
    }
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>
      {message && <Text style={styles.messageText}>{message}</Text>}

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  messageText:{
    color: 'green',
    alignSelf: 'center',
  },
});
