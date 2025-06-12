// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import ProfileScreen from './screens/Profile';
import LostFoundScreen from './screens/LostFoundScreen';
import LostPetForm from './screens/LostPetForm';
import PetAdoptionForm from './screens/PetAdoptionForm';
import AdoptionListScreen from './screens/AdoptionListScreen';
import AdoptionProcedureScreen from './screens/AdoptionProcedureScreen';
import EducationalResourcesScreen from './screens/EducationalResourcesScreen';
import HomeScreen from './screens/HomeScreen';
import FoundPetForm from './screens/FoundPet';
import SocialShareScreen from './screens/SocialShareScreen';
import AIRecognitionScreen from './screens/AIRecog';

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
        <Stack.Screen name="PetAdoptform" component={PetAdoptionForm} />
        <Stack.Screen name="adoptlist" component={AdoptionListScreen} />
        <Stack.Screen name="adoptpro" component={AdoptionProcedureScreen} />
        <Stack.Screen name="education" component={EducationalResourcesScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Found Pet" component={FoundPetForm} />
        <Stack.Screen name="Social" component={SocialShareScreen} />
        <Stack.Screen name="Ai" component={AIRecognitionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
