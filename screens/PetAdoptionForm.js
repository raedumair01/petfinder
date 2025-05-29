import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import BottomNavbar from '../components/BottomNavbar';
import { mockAdoptionPets } from '../data/mockData';
if (!mockAdoptionPets) mockAdoptionPets = [];

export default function PetAdoptionForm({ user, setUser }) {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tempUserId, setTempUserId] = useState(1);

  const pickImage = () => {
    const options = {
      title: 'Select Pet Image',
      mediaType: 'photo',
      quality: 1,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'An error occurred while selecting the image: ' + response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        setImageUrl(uri);
      }
    });
  };

  const handleSubmit = () => {
    if (!name || !type || !breed || !age || !description) {
      Alert.alert('Validation Error', 'Please fill in all fields before submitting.', [
        { text: 'OK', style: 'cancel' },
      ]);
      return;
    }

    if (!user || !user.id) {
      Alert.alert('Warning', 'User not found. Using a temporary user ID for this pet.');
    }

    const userIdToUse = user && user.id ? user.id : tempUserId;

    const newPet = {
      id: mockAdoptionPets.length + 1,
      userId: userIdToUse,
      name,
      type,
      breed,
      age: parseInt(age),
      description,
      image: imageUrl || 'https://images.unsplash.com/photo-1561037404-61cd46aa615b',
      adoptionStatus: 'available',
    };
    mockAdoptionPets.push(newPet);

    Alert.alert('Success', 'Pet listed for adoption successfully!');
    //   { text: 'OK', onPress: () => navigation.goBack() },
    // ]);

    if (!user || !user.id) {
      setTempUserId(tempUserId + 1);
    }

    setName('');
    setType('');
    setBreed('');
    setAge('');
    setDescription('');
    setImageUrl('');
  };

  const handleAdoptionList = () => {
    Alert.alert("Adoption Form Submitted", "Your pet has been listed for adoption.");
    navigation.navigate('adoptlist');
  };

  const handleAdoptionProcedure = () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a pet name to proceed with adoption procedure.');
      return;
    }
    const pet = {
      name,
      type,
      breed,
      age: parseInt(age) || 0,
      description,
      image: imageUrl || 'https://images.unsplash.com/photo-1561037404-61cd46aa615b',
    };
    navigation.navigate('adoptpro', { pet });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>List a Pet for Adoption</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Pet Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pet name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#6A7B7C"
          />
          <Text style={styles.label}>Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Dog, Cat"
            value={type}
            onChangeText={setType}
            placeholderTextColor="#6A7B7C"
          />
          <Text style={styles.label}>Breed</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Labrador"
            value={breed}
            onChangeText={setBreed}
            placeholderTextColor="#6A7B7C"
          />
          <Text style={styles.label}>Age (years)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholderTextColor="#6A7B7C"
          />
          <Text style={styles.label}>Pet Image (Optional)</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={() => { console.log('Button pressed'); pickImage(); }}>
            <Text style={styles.imagePickerText}>
              {imageUrl ? 'Image Selected' : 'Pick an Image from Gallery'}
            </Text>
          </TouchableOpacity>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.previewImage} />
          ) : (
            <Text style={[styles.label, styles.note]}>No image selected. A default image will be used.</Text>
          )}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Describe the pet"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#6A7B7C"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adoptionListButton} onPress={handleAdoptionList}>
            <Text style={styles.buttonText}>Adoption List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adoptionProcedureButton} onPress={handleAdoptionProcedure}>
            <Text style={styles.buttonText}>Adoption Procedure</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.spacer} /> {/* Increased spacer to allow more scrollable space */}
      </ScrollView>
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
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8B4A5',
    borderRadius: 20,
    backgroundColor: '#FFF8F2',
  },
  contentContainer: {
    paddingBottom: 60, // Increased padding to allow more scrollable space
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2B3334',
    marginBottom: 25,
    textAlign: 'center',
  },
  form: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#2B3334',
    marginBottom: 8,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6A7B7C',
    marginBottom: 15,
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 14,
    color: '#2B3334',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  imagePickerButton: {
    height: 50,
    backgroundColor: '#E8B4A5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: 10,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FAAD14',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  adoptionListButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#B85B2F',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  adoptionProcedureButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50', // Green color for differentiation
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  spacer: {
    height: 20, // Increased spacer height for more scrollable space
  },
});