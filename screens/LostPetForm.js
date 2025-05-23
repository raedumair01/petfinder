import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

export default function LostPetFormScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    petName: '',
    message: '',
    petType: '',
    petSex: '',
    dateMissing: new Date(), // Default to today (May 23, 2025)
    petImage: null,
    additionalDetails: '', // Separate field for Step 3
    address: '', // Separate field for Step 3
    phone: '', // Separate field for Step 4
    email: '', // Separate field for Step 4
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'petType', 'petSex', or 'date'

  const petTypes = ['Dog', 'Cat', 'Bird', 'Other'];
  const petSexes = ['Male', 'Female', 'Unknown'];

  // Generate date options (last year to today)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date('2025-05-23'); // Current date based on system (11:45 PM PKT)
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

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit the form (for now, just navigate back)
      navigation.goBack();
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
    backgroundColor: '#FFFBFA', // Warm off-white background
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
    color: '#B85B2F', // Terracotta
  },
  stepIndicator: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B3334', // Dark teal
  },
  homeButton: {
    fontSize: 24,
    color: '#B85B2F', // Terracotta
  },
  instruction: {
    fontSize: 14,
    color: '#2B3334', // Dark teal
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
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
  continueButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#B85B2F', // Terracotta
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