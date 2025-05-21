import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockPets } from '../data/mockData';
import PetCard from '../components/PetCard';
import BottomNavbar from '../components/BottomNavbar';

export default function ProfileScreen({ user, setUser }) {
  const [username, setUsername] = useState(user?.username || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const navigation = useNavigation();
  const userPets = mockPets.filter((pet) => pet.userId === user?.id);

  const handleUpdateProfile = () => {
    setUser({ ...user, username, firstName, lastName, phoneNumber });
    Alert.alert('Success', 'Profile updated');
  };

  // Default profile picture (replace with user.photo if available)
  const profilePicture = user?.photo ? { uri: user.photo } : { uri: 'https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg' };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={profilePicture}
            style={styles.profilePicture}
          />
          <Text style={styles.subtitle}></Text>
        </View>

        <View style={styles.form}>
          {/* <Text style={styles.label}>Email: {user?.email}</Text> */}
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <Text style={styles.label}>Email{user?.email}</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.petContainer}>
          <FlatList
            data={userPets}
            renderItem={({ item }) => <PetCard pet={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#52C41A' }]}
            onPress={() => navigation.navigate('PetAdoptionForm')}
          >
            <Text style={styles.buttonText}>List a Pet for Adoption</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FAAD14' }]}
            onPress={() => navigation.navigate('LostPetForm')}
          >
            <Text style={styles.buttonText}>Report Lost Pet</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomNavbar setUser={setUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFBFA',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFBFA',
    padding: 20,
    borderWidth: 5,
    borderColor: '#B85B2F',
    borderRadius: 32,
    marginBottom: 60, // Space for bottom navbar
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#C7CCCC', // Placeholder background
  },
  title: {
    paddingTop: 10,
    fontSize: 24,
    fontWeight: '500',
    color: '#2B3334',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#485456',
    textAlign: 'center',
  },
  form: {
    flex: 0.4,
  },
  label: {
    fontSize: 12,
    color: '#2B3334',
    marginBottom: 5,
    marginTop: -10
  },
  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7CCCC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    color: '#C7CCCC',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
    bottom:-190
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#B85B2F',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    
    
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  petContainer: {
    flex: 1,
    bottom:90
  },
  petTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2B3334',
    marginBottom: 10,
  },
});