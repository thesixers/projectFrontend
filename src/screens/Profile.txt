import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  const makeAuthenticatedRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (token !== null) {
        const response = await axios.get('http://192.168.0.167:3003/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const { Us } = response.data;
        const { name, email, gender, dob } = Us;

        setName(name);
        setEmail(email);
        setGender(gender);
        setDob(dob);

        console.log('User Data:', Us);
        
      } else {
        navigation.navigate('MainDrawer', { screen: 'Login' });
        console.log('Token not found');
      }
    } catch (error) {
      console.error('Error with authenticated request:', error);
    }
  };

  useEffect(() => {
    makeAuthenticatedRequest();
  },[]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.infoText}>{name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.infoText}>{email}</Text>

        <Text style={styles.label}>Gender:</Text>
        <Text style={styles.infoText}>{gender}</Text>

        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.infoText}>{dob}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => navigation.navigate('Logout')}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
