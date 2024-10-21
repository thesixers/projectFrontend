import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Drawer icon to open the drawer navigator */}
      <TouchableOpacity 
        style={styles.drawerButton} 
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
      </TouchableOpacity>

    

      {/* Placeholder for the circular logo */}
      <Image 
        source={{ uri: 'https://via.placeholder.com/150' }} 
        style={styles.logo}
      />

      {/* Login Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Sign Up')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  drawerText: {
    fontSize: 24,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
});
