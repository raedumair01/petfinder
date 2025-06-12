import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { mockFoundPets, mockLostPets } from '../data/mockData';
import BottomNavbar from '../components/BottomNavbar';

// Simple string similarity function
const getStringSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  let matchingChars = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matchingChars++;
  }
  return matchingChars / longer.length;
};

export default function FoundPetForm() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    foundDate: '',
    location: '',
    description: '',
    coordinates: '', // Store latitude, longitude as a string
  });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const navigation = useNavigation();

  // Update form data
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Check and request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to set the found pet location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    } else {
      try {
        const permission = await Geolocation.requestAuthorization('whenInUse');
        return permission === 'granted';
      } catch (err) {
        console.warn('iOS permission error:', err);
        return false;
      }
    }
  };

  // Fetch current location
  const getCurrentLocation = async () => {
    setIsFetchingLocation(true);
    try {
      console.log('Requesting location permission...');
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location permission is required. Please enable it in settings.');
        setIsFetchingLocation(false);
        return;
      }

      console.log('Fetching current position...');
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log('Position fetched:', { latitude, longitude });

      // Update coordinates in formData
      const coordString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      updateFormData('coordinates', coordString);

      // Reverse geocode using OpenStreetMap Nominatim API
      try {
        console.log('Attempting reverse geocoding...');
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        console.log('Geocoding response:', JSON.stringify(data, null, 2));

        if (data.address) {
          // Construct detailed address
          const road = data.address.road || data.address.pedestrian || '';
          const houseNumber = data.address.house_number || '';
          const neighbourhood = data.address.neighbourhood || data.address.suburb || '';
          const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
          const countryCode = data.address.country_code?.toUpperCase() || 'XX';

          // Build formatted address: e.g., "123 Main St, Gulberg, Lahore, PK"
          let formattedAddress = '';
          if (houseNumber && road) {
            formattedAddress += `${houseNumber} ${road}`;
          } else if (road) {
            formattedAddress += road;
          }
          if (neighbourhood) {
            formattedAddress += formattedAddress ? `, ${neighbourhood}` : neighbourhood;
          }
          if (city && city !== 'Unknown City') {
            formattedAddress += formattedAddress ? `, ${city}` : city;
          }
          formattedAddress += formattedAddress ? `, ${countryCode}` : `Unknown, ${countryCode}`;

          updateFormData('location', formattedAddress);
          Alert.alert('Success', `Location set to: ${formattedAddress}\nCoordinates: ${coordString}`);
        } else {
          console.warn('No address found in geocoding response.');
          updateFormData('location', `Unknown, XX`);
          Alert.alert(
            'Warning',
            `Could not determine location. Set to Unknown, XX.\nCoordinates: ${coordString}\nPlease edit location manually.`
          );
        }
      } catch (error) {
        console.warn('Reverse geocoding error:', error);
        updateFormData('location', `Unknown, XX`);
        Alert.alert(
          'Warning',
          `Failed to reverse geocode. Set to Unknown, XX.\nCoordinates: ${coordString}\nPlease edit location manually.`
        );
      }
    } catch (error) {
      console.warn('Location fetch error:', error);
      Alert.alert('Error', `Failed to fetch location: ${error.message}. Please enter manually.`);
      updateFormData('coordinates', '');
      updateFormData('location', '');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // Validation functions
  const validateForm = () => {
    const { type, breed, age, foundDate, location, description } = formData;

    if (!type || !breed || !age || !foundDate || !location || !description) {
      Alert.alert('Error', 'All fields except name are required.');
      return false;
    }

    // Updated regex to allow more detailed addresses ending with ", CC"
    if (!/^[A-Za-z0-9\s,.]+,\s*[A-Z]{2}$/.test(location)) {
      Alert.alert('Error', 'Location must end with country code, e.g., 123 Main St, Lahore, PK');
      return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(foundDate) || isNaN(new Date(foundDate).getTime())) {
      Alert.alert('Error', 'Date must be in format: YYYY-MM-DD and valid.');
      return false;
    }

    if (isNaN(parseInt(age)) || parseInt(age) <= 0) {
      Alert.alert('Error', 'Age must be a positive number.');
      return false;
    }

    return true;
  };

  // Pet matching system
  const findMatchingLostPets = (newFoundPet) => {
    return mockLostPets
      .map((lostPet) => {
        let score = 0;

        // Type match (30% weight)
        if (lostPet.type.toLowerCase() === newFoundPet.type.toLowerCase()) {
          score += 30;
        }

        // Breed match (25% weight)
        if (lostPet.breed.toLowerCase() === newFoundPet.breed.toLowerCase()) {
          score += 25;
        }

        // Location match (20% weight) - Compare only city and country code
        const getCityCountry = (loc) => loc.split(',').slice(-2).join(',').trim().toLowerCase();
        if (getCityCountry(lostPet.location) === getCityCountry(newFoundPet.location)) {
          score += 20;
        }

        // Age proximity (15% weight)
        const ageDiff = Math.abs(parseInt(lostPet.age) - parseInt(newFoundPet.age));
        if (ageDiff <= 2) {
          score += 15 * (1 - ageDiff / 2);
        }

        // Description similarity (10% weight)
        const descSimilarity = getStringSimilarity(lostPet.description, newFoundPet.description);
        score += 10 * descSimilarity;

        return { pet: lostPet, score };
      })
      .filter((match) => match.score >= 60)
      .sort((a, b) => b.score - a.score);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newFoundPet = {
      id: mockFoundPets.length + 1,
      name: formData.name || 'Unknown',
      type: formData.type,
      breed: formData.breed,
      age: parseInt(formData.age),
      image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80',
      foundDate: formData.foundDate,
      location: formData.location,
      description: formData.description,
      coordinates: formData.coordinates,
    };

    mockFoundPets.push(newFoundPet);

    const matches = findMatchingLostPets(newFoundPet);
    if (matches.length > 0) {
      const matchDetails = matches
        .map((match) => `Lost Pet: ${match.pet.name || 'Unknown'} (Score: ${Math.round(match.score)}%)`)
        .join('\n');
      Alert.alert(
        'Potential Matches Found!',
        `Found ${matches.length} potential match(es):\n${matchDetails}`,
        [{ text: 'OK', onPress: () => navigation.navigate('LostPets') }]
      );
    } else {
      Alert.alert('Success', 'Pet reported successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Report a Found Pet</Text>
          <View style={styles.form}>
            {[
              { label: 'Name (optional)', field: 'name', placeholder: 'Pet Name' },
              { label: 'Type', field: 'type', placeholder: 'e.g., Dog, Cat' },
              { label: 'Breed', field: 'breed', placeholder: 'e.g., Unknown' },
              { label: 'Age', field: 'age', placeholder: 'Age in years', keyboardType: 'numeric' },
              { label: 'Found Date', field: 'foundDate', placeholder: 'YYYY-MM-DD' },
              {
                label: 'Location',
                field: 'location',
                placeholder: 'e.g., 123 Main St, Lahore, PK',
                special: 'location',
              },
              {
                label: 'Coordinates (Lat, Lon)',
                field: 'coordinates',
                placeholder: 'Not fetched yet',
                readOnly: true,
              },
              {
                label: 'Description',
                field: 'description',
                placeholder: 'Describe the pet and where it was found',
                multiline: true,
                numberOfLines: 4,
              },
            ].map(({ label, field, placeholder, keyboardType, multiline, numberOfLines, special, readOnly }) => (
              <View style={styles.inputContainer} key={field}>
                <Text style={styles.label}>{label}</Text>
                {special === 'location' ? (
                  <View style={styles.locationContainer}>
                    <TextInput
                      style={[styles.input, styles.locationInput]}
                      placeholder={placeholder}
                      placeholderTextColor="#A3A3A3"
                      value={formData[field]}
                      onChangeText={(value) => updateFormData(field, value)}
                    />
                    <TouchableOpacity
                      style={[styles.locationButton, isFetchingLocation && styles.disabledButton]}
                      onPress={getCurrentLocation}
                      disabled={isFetchingLocation}
                    >
                      <Text style={styles.locationButtonText}>
                        {isFetchingLocation ? 'Fetching...' : 'Use Current Location'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TextInput
                    style={[styles.input, multiline && styles.descriptionInput]}
                    placeholder={placeholder}
                    placeholderTextColor="#A3A3A3"
                    value={formData[field]}
                    onChangeText={(value) => !readOnly && updateFormData(field, value)}
                    editable={!readOnly}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                  />
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomNavbar/>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    margin: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    marginRight: 10,
  },
  locationButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  disabledButton: {
    backgroundColor: '#6EE7B7',
    opacity: 0.6,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  button: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});