import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockPets } from '../data/mockData';
import PetCard from '../components/PetCard';
import BottomNavbar from '../components/BottomNavbar';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

export default function ProfileScreen({ user: propUser, setUser: propSetUser }) {
  const navigation = useNavigation();
  const [localUser, setLocalUser] = useState({
    ...propUser,
    username: propUser?.username || '',
    firstName: propUser?.firstName || '',
    lastName: propUser?.lastName || '',
    phoneNumber: propUser?.phoneNumber || '',
    photo: propUser?.photo || 'https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg',
  });
  const [username, setUsername] = useState(localUser.username);
  const [firstName, setFirstName] = useState(localUser.firstName);
  const [lastName, setLastName] = useState(localUser.lastName);
  const [phoneNumber, setPhoneNumber] = useState(localUser.phoneNumber);
  const userPets = mockPets.filter((pet) => pet.userId === localUser?.id);

  useEffect(() => {
    setLocalUser((prev) => ({
      ...prev,
      username: propUser?.username || prev.username,
      firstName: propUser?.firstName || prev.firstName,
      lastName: propUser?.lastName || prev.lastName,
      phoneNumber: propUser?.phoneNumber || prev.phoneNumber,
      photo: propUser?.photo || prev.photo,
    }));
    setUsername(propUser?.username || '');
    setFirstName(propUser?.firstName || '');
    setLastName(propUser?.lastName || '');
    setPhoneNumber(propUser?.phoneNumber || '');
  }, [propUser]);

  const handleUpdateProfile = () => {
    const updatedUser = { ...localUser, username, firstName, lastName, phoneNumber };
    if (propSetUser) {
      propSetUser(updatedUser); // Update global user state if propSetUser exists
    }
    setLocalUser(updatedUser); // Always update local state
    Alert.alert('Success', 'Profile updated');
  };

  const handleImagePick = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose an option',
      [
        { text: 'Gallery', onPress: () => launchImageLibrary({ mediaType: 'photo' }, handleImageResponse) },
        { text: 'Camera', onPress: () => launchCamera({ mediaType: 'photo' }, handleImageResponse) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', 'Unable to pick image. Please try again.');
    } else {
      const uri = response.assets[0].uri;
      const updatedUser = { ...localUser, photo: uri };
      if (propSetUser) {
        propSetUser(updatedUser); // Update global user state if propSetUser exists
      }
      setLocalUser(updatedUser); // Always update local state
    }
  };

  // Default profile picture (use localUser.photo)
  const profilePicture = { uri: localUser.photo };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={profilePicture}
              style={styles.profilePicture}
            />
          </TouchableOpacity>
          <Text style={styles.subtitle}>{localUser?.email || 'No email provided'}</Text>
        </View>

        {/* Combined Form and Button Container */}
        <View style={styles.formContainer}>
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
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.petContainer}>
          <FlatList
            data={userPets}
            renderItem={({ item }) => <PetCard pet={item} />}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No pets listed.</Text>}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#52C41A' }]}
            onPress={() => navigation.navigate('PetAdoptform')}
          >
            <Text style={styles.buttonText}>List a Pet for Adoption</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FAAD14' }]}
            onPress={() => navigation.navigate('LostForm')}
          >
            <Text style={styles.buttonText}>Report Lost Pet</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomNavbar setUser={propSetUser || setLocalUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFBFA', // Warm off-white background
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFBFA',
    padding: 20,
    borderWidth: 0,
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
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#485456', // Muted teal
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2B3334', // Dark teal
    marginBottom: 5,
    marginTop: 10,
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
    color: '#2B3334', // Dark teal for text
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#B85B2F', // Terracotta
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  petContainer: {
    flex: 1,
  },
  petTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2B3334', // Dark teal
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    color: '#6A7B7C', // Lighter muted teal
    textAlign: 'center',
    marginVertical: 20,
  },
});