import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HealthHistory = () => {
  const [healthData, setHealthData] = useState([]);

  const makeAuthenticatedRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        const response = await axios.get('http://192.168.0.167:3003/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { fHD } = response.data;

        console.log('Health Data:', fHD);

        if (Array.isArray(fHD) && fHD.length > 0) {
          setHealthData(fHD.reverse());
        } else {
          console.log('No health data found');
        }

      } else {
        console.log('Token not found');
        // navigation.navigate('MainDrawer', { screen: 'Login' });
      }
    } catch (error) {
      console.error('Error with authenticated request:', error);
    }
  };

  useEffect(() => {
    makeAuthenticatedRequest();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Health History</Text>

      {healthData.length === 0 ? (
        <Text style={styles.noDataText}>No health data available</Text>
      ) : (
        healthData.map((item, index) => (
          <View key={index} style={styles.entryContainer}>
            <Text style={styles.dateText}>{item.createdAt}</Text>
            <Text style={styles.statText}>Weight: {item.weight}</Text>
            <Text style={styles.statText}>Sleep Hours: {item.sleepHours}</Text>
            <Text style={styles.statText}>BPM: {item.bpm}</Text>
            <Text style={styles.statText}>Blood Pressure: {item.systolic}/{item.diastolic} mmHg</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default HealthHistory;

const styles = StyleSheet.create({
  container: {
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
  entryContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statText: {
    fontSize: 16,
    marginVertical: 5,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});
