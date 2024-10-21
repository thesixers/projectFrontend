import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useEffect } from 'react';

// Main Screens
import Home from './src/components/Home';
import Login from './src/components/Login';
import SignUp from './src/components/Signup';

// Service Provider Screens
import Dashboard from './src/screens/Dashboard';
import HealthDataInput from './src/screens/HealthDataInput';
import HealthHistory from './src/screens/HealthHistory';
import Logout from './src/screens/Logout';
import Profile from './src/screens/Profile';
import HealthStatus from './src/screens/HealthStatus';
import axios from 'axios';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Main Drawer Navigator
function MainDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Sign Up" component={SignUp} />
    </Drawer.Navigator>
  );
}

// User Drawer
function UserDrawer() {
  return (
    <Drawer.Navigator initialRouteName="UserMenu">
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Health Data Input" component={HealthDataInput} />
      <Drawer.Screen name="Health History" component={HealthHistory} />
      <Drawer.Screen name="Health Status" component={HealthStatus} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}


export default function App() {

  async function Connect(){
    try {
      let res = await axios.get('http://192.168.43.26.26:3003/');
      console.log(res.data);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    Connect();
  },[])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainDrawer">
        <Stack.Screen
          name="MainDrawer"
          component={MainDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerTitle: 'Login' }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerTitle: 'Sign Up' }}
        />
        <Stack.Screen
          name="UserDrawer"
          component={UserDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Logout"
          component={Logout}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
