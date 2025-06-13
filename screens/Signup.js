import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

export default function SignupScreen({ users = [], setUsers, setUser }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+234'); // Default to Nigeria
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const countryCodes = [
    { label: '+92 (Pakistan)', value: '+92' },
    { label: '+234 (Nigeria)', value: '+234' },
    { label: '+1 (USA)', value: '+1' },
    { label: '+44 (UK)', value: '+44' },
    { label: '+91 (India)', value: '+91' },
    { label: '+61 (Australia)', value: '+61' },
  ];

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (code, phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (code === '+234') {
      return /^070\d{8}$/.test(cleanPhone);
    } else {
      return /^\d{8,15}$/.test(cleanPhone) && !cleanPhone.startsWith('070');
    }
  };

  const handleSignup = () => {
    if (!fullName || !email || !phoneNumber || !countryCode || !password || !confirmPassword) {
      return Alert.alert('Error', 'All fields are required');
    }
    if (!validateEmail(email)) {
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
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    const newUser = {
      fullName,
      email,
      phone: `${countryCode}${phoneNumber.replace(/\D/g, '')}`,
      password,
    };
    // setUsers([...users, newUser]);
    // setUser(newUser);

    Alert.alert('Success', 'Account created!');
    navigation.navigate('Profile');

    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setCountryCode('+234');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Create an account to get started</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Sayo Adebayo"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.phoneContainer}>
        <RNPickerSelect
          onValueChange={(value) => {
            setCountryCode(value);
            console.log('Selected country code:', value); // Debug log
          }}
          items={countryCodes}
          style={{
            inputIOS: styles.pickerInput,
            inputAndroid: styles.pickerInput,
            placeholder: styles.pickerPlaceholder,
          }}
          value={countryCode}
          placeholder={{ label: 'Select country', value: null }}
          useNativeAndroidPickerStyle={false} // Custom style for Android
        />
        <TextInput
          style={[styles.input, styles.phoneInput]}
          placeholder={countryCode === '+234' ? '07012345678' : '1234567890'}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFBFA',
    borderWidth: 5,
    borderColor: '#B85B2F',
    borderRadius: 32,
    flexGrow: 1,
  },
  title: {
    paddingTop: 50,
    fontSize: 24,
    fontWeight: '500',
    color: '#2B3334',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#485456',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#2B3334',
    marginBottom: 5,
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
    bottom:-7,
  },
  pickerInput: {
    height: 48,
    width: 150, // Increased for better visibility
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7CCCC',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#2B3334',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        paddingVertical: 12, // Align text vertically
      },
      android: {
        paddingVertical: 0, // Avoid extra padding on Android
      },
    }),
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
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loginText: {
    fontSize: 14,
    color: '#262631',
    textAlign: 'center',
  },
});