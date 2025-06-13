import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+234'); // Default to Nigeria
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

    // Extract country code and phone number
    if (propUser?.phoneNumber) {
      const phone = propUser.phoneNumber;
      if (phone.startsWith('+234')) {
        setCountryCode('+234');
        setPhoneNumber(phone.slice(4)); // Remove +234
      } else if (phone.startsWith('+1')) {
        setCountryCode('+1');
        setPhoneNumber(phone.slice(2));
      } else if (phone.startsWith('+44')) {
        setCountryCode('+44');
        setPhoneNumber(phone.slice(3));
      } else if (phone.startsWith('+91')) {
        setCountryCode('+91');
        setPhoneNumber(phone.slice(3));
      } else if (phone.startsWith('+61')) {
        setCountryCode('+61');
        setPhoneNumber(phone.slice(3));
      } else {
        setPhoneNumber(phone); // Fallback
      }
    }
  }, [propUser]);

  const countryCodes = [
    { label: '+234 (Nigeria)', value: '+234' },
    { label: '+1 (USA)', value: '+1' },
    { label: '+44 (UK)', value: '+44' },
    { label: '+91 (India)', value: '+91' },
    { label: '+61 (Australia)', value: '+61' },
  ];

  const validatePhone = (code, phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (code === '+234') {
      return /^070\d{8}$/.test(cleanPhone);
    } else {
      return /^\d{8,15}$/.test(cleanPhone) && !cleanPhone.startsWith('070');
    }
  };

  const handleUpdateProfile = () => {
    if (!firstName || !username || !phoneNumber || !countryCode) {
      return Alert.alert('Error', 'All fields are required');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      return Alert.alert('Error', 'Please enter a valid email address');
    }
    if (!validatePhone(countryCode, phoneNumber)) {
      return Alert.alert(
        'Error',
        countryCode === '+234'
          ? 'Phone number must start with 070 and be 11 digits'
          : 'Phone number must be 8–15 digits and not start with 070'
      );
    }

    const updatedUser = {
      ...localUser,
      username,
      firstName,
      lastName,
      phoneNumber: `${countryCode}${phoneNumber.replace(/\D/g, '')}`,
    };
    if (propSetUser) {
      propSetUser(updatedUser);
    }
    setLocalUser(updatedUser);
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
        propSetUser(updatedUser);
      }
      setLocalUser(updatedUser);
    }
  };

  const profilePicture = { uri: localUser.photo };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image source={profilePicture} style={styles.profilePicture} />
          </TouchableOpacity>
          <Text style={styles.subtitle}>{localUser?.email || 'No email provided'}</Text>
        </View>

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
          <View style={styles.phoneContainer}>
            <RNPickerSelect
              onValueChange={(value) => setCountryCode(value)}
              items={countryCodes}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
                placeholder: styles.pickerPlaceholder,
              }}
              value={countryCode}
              placeholder={{ label: 'Select country', value: null }}
              useNativeAndroidPickerStyle={false}
            />
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder={countryCode === '+234' ? '07012345678' : '1234567890'}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.petContainer}>
          {/* <FlatList
            data={userPets}
            renderItem={({ item }) => <PetCard pet={item} />}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No pets listed.</Text>}
          /> */}
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
      </ScrollView>
      <BottomNavbar setUser={propSetUser || setLocalUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFBFA',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFBFA',
    padding: 20,
    borderWidth: 0,
    borderRadius: 32,
    marginBottom: 60,
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
    backgroundColor: '#C7CCCC',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#485456',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2B3334',
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
    color: '#2B3334',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  phoneInput: {
    flex: 1,
    marginLeft: 10,
    bottom: -7, // Adjusted to align with the picker
  },
  pickerInput: {
    height: 48,
    width: 140,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7CCCC',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#2B3334',
    justifyContent: 'center',
  },
  pickerPlaceholder: {
    color: '#696969',
    fontSize: 14,
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#B85B2F',
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
  emptyText: {
    fontSize: 15,
    color: '#6A7B7C',
    textAlign: 'center',
    marginVertical: 20,
  },
});