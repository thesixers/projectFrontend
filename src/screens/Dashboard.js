import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Dashboard = () => {
  const [healthStats, setHealthStats] = useState([]); // Use state to store health stats
  const [loading, setLoading] = useState(true); // Loading state

  const navigation = useNavigation();

  const makeAuthenticatedRequest = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (token !== null) {
        const response = await axios.get('http://192.168.0.167:3003/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { Us, fHD, fHS } = response.data;

        if(fHD.length > 0){
          let L = fHD.length;
        let Latest = fHD[L - 1];
        let { weight, sleepHours, bpm, systolic, diastolic } = Latest;

        const newStats = [
          { key: `Weight: ${weight} kg` },
          { key: `Sleep Hours: ${sleepHours} Hrs` },
          { key: `BPM: ${bpm}` },
          { key: `Blood Pressure: ${systolic}/${diastolic} mmHg` },
        ];

        setHealthStats(newStats);
        setLoading(false);
        }else{
          const newStats = [];
  
          setHealthStats(newStats);
          setLoading(false);
        }

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
  }, []);

  const renderStat = ({ item }) => (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{item.key}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Latest Health Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.statLabel}>Latest Health Statistics</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={healthStats}
            renderItem={renderStat}
            keyExtractor={(item) => item.key}
          />
        )}
      </View>

      {/* Links to Health Data History and Other Features */}
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => navigation.navigate('Health History')}
      >
        <Text style={styles.buttonText}>View Health Data History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  statsContainer: {
    marginBottom: 40,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  statLabel: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    color: '#4CAF50',
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  statValue: {
    fontSize: 18,
    color: '#555',
  },
  linkButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
