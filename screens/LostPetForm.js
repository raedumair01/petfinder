import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, FlatList, Alert, Platform, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';

export default function LostPetFormScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    petName: '',
    message: '',
    petType: '',
    petSex: '',
    dateMissing: new Date(), // Default to today (June 03, 2025, 12:35 AM PKT)
    petImage: null,
    additionalDetails: '',
    address: '',
    phone: '',
    email: '',
    latitude: null,
    longitude: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'petType', 'petSex', or 'date'

  const petTypes = ['Dog', 'Cat', 'Bird', 'Other'];
  const petSexes = ['Male', 'Female', 'Unknown'];

  // Request location permission for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      console.log('Initial permission check:', granted ? 'Granted' : 'Denied');
      if (granted) {
        console.log('Location permission already granted');
        return true;
      }
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to mark where your pet was lost.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        console.log('Permission request result:', result);
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          return true;
        } else {
          console.log('Location permission denied');
          Alert.alert(
            'Permission Denied',
            'Location access is required to fetch your current location. Please grant permission in settings or tap "Get Current Location" again.',
            [
              { text: 'OK' },
              { text: 'Open Settings', onPress: () => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) },
            ]
          );
          return false;
        }
      } catch (err) {
        console.warn('Permission request error:', err);
        Alert.alert('Error', 'Failed to request location permission. Please check settings.');
        return false;
      }
    }
    return true; // For iOS, permission is handled via Info.plist
  };

  // Fetch current location
  const getCurrentLocation = async () => {
    console.log('Attempting to get current location...');
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.log('Location permission not granted, aborting location fetch');
      return;
    }

    console.log('Fetching location with permission granted');
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({ ...formData, latitude, longitude });
        console.log('Location fetched:', latitude, longitude);
        Alert.alert('Success', `Location fetched: (${latitude}, ${longitude})`);
      },
      (error) => {
        console.error('Location Error:', error.message, error.code);
        Alert.alert('Error', `Unable to fetch location: ${error.message}. Ensure location services are enabled.`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Generate date options (last year to today)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date('2025-06-03T00:35:00+05:00'); // Current date and time (PKT)
    for (let i = 0; i <= 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Fetch data from the FastAPI backend when the screen loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/LostPetFormScreen', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
          setFormData({
            petName: data.petName || '',
            message: data.message || '',
            petType: data.petType || '',
            petSex: data.petSex || '',
            dateMissing: data.dateMissing ? new Date(data.dateMissing) : new Date(),
            petImage: data.petImage ? { uri: data.petImage } : null,
            additionalDetails: data.additionalDetails || '',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            latitude: data.latitude || null,
            longitude: data.longitude || null,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        Alert.alert('Error', `Failed to load data: ${error.message}. If using an emulator/device, replace 127.0.0.1 with your host IP (e.g., 192.168.1.x).`);
      }
    };

    fetchData();
  }, []);

  const handleSelectOption = (value) => {
    if (modalType === 'petType') {
      setFormData({ ...formData, petType: value });
    } else if (modalType === 'petSex') {
      setFormData({ ...formData, petSex: value });
    } else if (modalType === 'date') {
      setFormData({ ...formData, dateMissing: value });
    }
    setModalVisible(false);
  };

  const handleImagePick = () => {
    console.log('Opening image picker...');
    Alert.alert(
      'Select Image',
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
      setFormData({ ...formData, petImage: { uri } });
    }
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit the form data to the FastAPI backend
      try {
        const payload = {
          petName: formData.petName,
          message: formData.message,
          petType: formData.petType,
          petSex: formData.petSex,
          dateMissing: formatDate(formData.dateMissing),
          petImage: formData.petImage ? formData.petImage.uri : null,
          additionalDetails: formData.additionalDetails,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          latitude: formData.latitude,
          longitude: formData.longitude,
        };

        const response = await fetch('http://127.0.0.1:8000/LostPetFormScreen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        Alert.alert('Success', 'Lost pet form submitted successfully!');
        navigation.goBack();
      } catch (error) {
        console.error('Error submitting form:', error.message);
        Alert.alert('Error', `Failed to submit the form: ${error.message}. If using an emulator/device, replace 127.0.0.1 with your host IP (e.g., 192.168.1.x).`);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Pet Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name..."
              value={formData.petName}
              onChangeText={(text) => setFormData({ ...formData, petName: text })}
            />
            <Text style={styles.label}>Message (Optional)</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Message..."
              value={formData.message}
              onChangeText={(text) => setFormData({ ...formData, message: text })}
              multiline
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Pet Type</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                setModalType('petType');
                setModalVisible(true);
              }}
            >
              <Text style={styles.dropdownText}>
                {formData.petType || 'Select type of pet'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Pet Sex</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                setModalType('petSex');
                setModalVisible(true);
              }}
            >
              <Text style={styles.dropdownText}>
                {formData.petSex || 'Select Sex of pet'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Date Missing</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                setModalType('date');
                setModalVisible(true);
              }}
            >
              <Text style={styles.dropdownText}>
                {formatDate(formData.dateMissing)}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Picture of Pet</Text>
            <TouchableOpacity style={styles.imagePlaceholder} onPress={handleImagePick}>
              <Image
                source={formData.petImage || { uri: 'https://via.placeholder.com/80?text=Pet+Image' }}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Additional Details</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Add more details (e.g., breed, color, distinguishing marks)..."
              value={formData.additionalDetails}
              onChangeText={(text) => setFormData({ ...formData, additionalDetails: text })}
              multiline
            />
            <Text style={styles.label}>Address Where Pet Was Lost</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address..."
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
            <Text style={styles.label}>Coordinates (Optional)</Text>
            <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
              <Text style={styles.locationButtonText}>Get Current Location</Text>
            </TouchableOpacity>
            {formData.latitude && formData.longitude ? (
              <Text style={styles.coordinatesText}>
                Latitude: {formData.latitude}, Longitude: {formData.longitude}
              </Text>
            ) : (
              <Text style={styles.coordinatesText}>No coordinates selected.</Text>
            )}
          </View>
        );
      case 4:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Contact Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number..."
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Email..."
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>{step}/4</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeButton}>🏠</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.instruction}>
        The following steps will help you bring your pawfriend home more quickly if your pawfriend ever goes missing.
      </Text>
      {renderStep()}

      {/* Modal for Dropdown or Date Picker */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={modalType === 'petType' ? petTypes : modalType === 'petSex' ? petSexes : dateOptions}
              keyExtractor={(item) => (modalType === 'date' ? formatDate(item) : item)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectOption(modalType === 'date' ? item : item)}
                >
                  <Text style={styles.modalItemText}>
                    {modalType === 'date' ? formatDate(item) : item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFBFA',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#B85B2F',
  },
  stepIndicator: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B3334',
  },
  homeButton: {
    fontSize: 24,
    color: '#B85B2F',
  },
  instruction: {
    fontSize: 14,
    color: '#2B3334',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
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
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7CCCC',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 14,
    color: '#2B3334',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#2B3334',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '80%',
    maxHeight: '50%',
    padding: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#C7CCCC',
  },
  modalItemText: {
    fontSize: 14,
    color: '#2B3334',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7CCCC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  locationButton: {
    height: 48,
    backgroundColor: '#E8B4A5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  coordinatesText: {
    fontSize: 14,
    color: '#2B3334',
    marginBottom: 15,
  },
  continueButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#B85B2F',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});