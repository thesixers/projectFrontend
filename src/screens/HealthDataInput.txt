import axios from 'axios';
import React, { useState, useEffect } from 'react';  // Ensure useEffect is imported
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HealthDataInput = () => {
  const [weight, setWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [bpm, setBpm] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [id, setId] = useState('');

  const makeAuthenticatedRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (token !== null) {
        const response = await axios.get('http://192.168.0.167:3003/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const { Us, fHD, fHS } = response.data;

        setId(Us._id); 
      } else {
        navigation.navigate('MainDrawer', { screen: 'Login' });
        console.log('Token not found');
      }
    } catch (error) {
      console.error('Error with authenticated request:', error);
    }
  };

  useEffect(() => {
    makeAuthenticatedRequest();  // Fetch user data after component mounts
  }, []);

  const handleSubmit = async () => {
    if (!weight || !sleepHours || !bpm || !systolic || !diastolic) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      let res = await axios.post('http://192.168.0.167:3003/healthdata/', { id, weight, sleepHours, bpm, systolic, diastolic });

      if(res.status === 200){
        setWeight('');
        setSleepHours('');
        setBpm('');
        setSystolic('');
        setDiastolic('');
        Alert.alert('Success', 'Health data submitted successfully!');
      }else{
        Alert.alert('Error', 'Error uploading Health data pls try again!');
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Input Health Data</Text>

      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Sleep Hours (hrs)"
        keyboardType="numeric"
        value={sleepHours}
        onChangeText={setSleepHours}
      />
      <TextInput
        style={styles.input}
        placeholder="BPM (Beats Per Minute)"
        keyboardType="numeric"
        value={bpm}
        onChangeText={setBpm}
      />
      <View style={styles.bloodPressureContainer}>
        <TextInput
          style={styles.bloodPressureInput}
          placeholder="Systolic (mmHg)"
          keyboardType="numeric"
          value={systolic}
          onChangeText={setSystolic}
        />
        <TextInput
          style={styles.bloodPressureInput}
          placeholder="Diastolic (mmHg)"
          keyboardType="numeric"
          value={diastolic}
          onChangeText={setDiastolic}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HealthDataInput;

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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  bloodPressureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  bloodPressureInput: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
