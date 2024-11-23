import React from 'react'; 
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Show confirmation alert
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel', // Closes the alert when tapped
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Remove token from AsyncStorage
              await AsyncStorage.removeItem('token');
              navigation.navigate('MainDrawer', { screen: 'Home' });
              console.log('User logged out, token removed');

              // Navigate to login screen after logout
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
          style: 'destructive', // Red colored button for logout
        },
      ],
      { cancelable: true } // Allow cancellation by tapping outside
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>

      <Text style={styles.message}>
        Are you sure you want to log out of your account?
      </Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Return Button */}
      <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Return</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30', // Red color for destructive actions
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20, // Spacing between buttons
  },
  returnButton: {
    backgroundColor: '#4CAF50', // Green color for return
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
