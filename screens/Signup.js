import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen({ users = [], setUsers, setUser }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^070\d{8}$/.test(phone);

  const handleSignup = () => {
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      return Alert.alert('Error', 'All fields are required');
    }
    if (!validateEmail(email)) {
      return Alert.alert('Error', 'Please enter a valid email address');
    }
    if (!validatePhone(phoneNumber)) {
      return Alert.alert('Error', 'Phone number must start with 070 and be 11 digits');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    Alert.alert('Success', 'Account created!');
    navigation.navigate('Profile');

    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}></Text>

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
        placeholder="aacsedoelkeOgmiek.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="070*******"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

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
        <Text style={styles.loginText}>Already have an Account? Log in</Text>
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
