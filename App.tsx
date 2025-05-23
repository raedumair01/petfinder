// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import ProfileScreen from './screens/Profile';
import LostFoundScreen from './screens/LostFoundScreen';
import LostPetForm from './screens/LostPetForm';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="LostFound" component={LostFoundScreen} />
        <Stack.Screen name="LostForm" component={LostPetForm} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
