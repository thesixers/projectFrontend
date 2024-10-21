import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HealthStatus = () => {
  const [stat, setStat] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [bpm, setBpm] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [loading, setLoading] = useState(true);

  const handleUpdate = () => {
    Alert.alert('Health Status Updated', `Weight: ${stat}, Height: ${riskLevel}, BPM: ${bpm}, Blood Pressure: ${systolic}/${diastolic} mmHg`);
  };

  const makeAuthenticatedRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        const response = await axios.get('http://192.168.0.167:3003/user/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const { Us, fHD, fHS } = response.data;
        let L = fHD.length;
        let sL = fHS.length;

        if (fHD.length > 0) {
          let Latest = fHD[L - 1];
          setBpm(Latest.bpm);
          setSystolic(Latest.systolic);
          setDiastolic(Latest.diastolic);
        }

        if (fHS.length > 0) {
          let lS = fHS[sL - 1];
          setStat(lS.status);
          setRiskLevel(lS.riskLevel);
        }
      }else{
        navigation.navigate('MainDrawer', { screen: 'Login' });
      }
    } catch (error) {
      console.error('Error with authenticated request:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    makeAuthenticatedRequest();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Current Health Status</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.label}>BPM:</Text>
        <Text style={styles.value}>{bpm}</Text>

        <Text style={styles.label}>Blood Pressure:</Text>
        <Text style={styles.value}>{systolic}/{diastolic} mmHg</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{stat}</Text>

        <Text style={styles.label}>Risk Level:</Text>
        <Text style={styles.value}>{riskLevel}</Text>
      </View>

      
    </ScrollView>
  );
};

export default HealthStatus;

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
  statusContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 5,
  },
  value: {
    fontSize: 18,
    marginBottom: 15,
    color: '#4CAF50',
  },
  updateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
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
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
