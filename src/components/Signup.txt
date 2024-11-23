import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male');
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});  // State to hold error messages
  const navigation = useNavigation();
  const [message, setMessage] = useState('');

  const validateForm = () => {
    let valid = true;
    let errors = {};
  
    if (name.trim() === '') {
      errors.name = 'Name is required';
      valid = false;
    } else {
      const nameParts = name.trim().split(' ');
      if (nameParts.length < 2) {
        errors.name = 'Pls Enter at least 2 names';
        valid = false;
      } else {
        for (const part of nameParts) {
          if (part.length < 2) {
            errors.name = 'Each part of the name must be at least 2 characters long';
            valid = false;
            break;
          }
        }
      }
    }
  
    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Enter a valid email address';
      valid = false;
    }
  
    // Password validation: minimum 6 characters
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      valid = false;
    }
  
    setErrors(errors);
    return valid;
  };

  // Function to handle signup
  const onSignUp = async () => {
    let error = {};

    if (validateForm()) {
      const userData = {
        name,
        email,
        password,
        gender,
        dob,
      };

      try {
        const response = await axios.post('http://192.168.0.167:3003/auth/register', userData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setMessage(response.data.message || 'Signup successful');
          setTimeout(() => {
            navigation.navigate('MainDrawer', { screen: 'Login' });
          }, 1000);
        } else if (response.status === 500) {
          const { errors } = response.data;

          if (errors.email) {
            error.email = errors.user;
          }

          if (errors.password) {
            error.password = errors.password;
          }

          setErrors(error);
        }
      } catch (error) {
        console.error('Error:', error);

        if (error.response) {
          console.log('Server responded with:', error.response.data);
          setMessage('Signup failed. Please try again.');

          let {email, password, user} = err.response.data.error;
          if (user) {
            Alert.alert('Error',user, [{ text: 'OK' }]);
          }
          if (password) {
            Alert.alert('Error',password, [{ text: 'OK' }]);
          }
          if (email) {
            Alert.alert('Error',email, [{ text: 'OK' }]);
          }
        }
        
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {message && <Text style={styles.messageText}>{message}</Text>}

      {/* Input Fields with Validation */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Gender Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Gender</Text>
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      {/* Date of Birth Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={styles.dateText}>{dob.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || dob;
            setShowDatePicker(false);
            setDob(currentDate);
          }}
        />
      )}

      {/* Sign Up Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={onSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Already have an account - navigate to login */}
      <TouchableOpacity 
        style={styles.loginTextContainer} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  messageText: {
    color: 'green',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loginTextContainer: {
    marginTop: 20,
  },
  loginText: {
    color: '#1E90FF',
    fontSize: 16,
  },
  pickerContainer: {
    width: '100%',
    marginVertical: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  dateText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Signup;
