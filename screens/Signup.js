import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen({ users = [], setUsers, setUser }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^070\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleSignup = () => {
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!validatePhone(phoneNumber)) {
      Alert.alert('Error', 'Phone number must start with 070 and be 11 digits');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    // Commented out email uniqueness check to simplify
    // if (users.some((u) => u.email === email)) {
    //   Alert.alert('Error', 'Email already registered');
    //   return;
    // }

    // const newUser = { id: users.length + 1, email, password, fullName, phoneNumber };
    // setUsers([...users, newUser]);
    // setUser(newUser);
    Alert.alert('Success', 'Account created!');
    navigation.navigate('Profile');

    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign up</Text>
        <Text style={styles.subtitle}></Text>
      </View>

      <View style={styles.form}>
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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <View style={styles.loginLinkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Already have an Account? Log in</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.socialContainer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBFA',
    padding: 20,
    borderWidth: 5,
    borderColor: '#B85B2F',
    borderRadius: 32,
    height: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    paddingTop: 50,
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
    flex: 1,
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
    color: '#C7CCCC',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 150,
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
  loginLinkContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#262631',
  },
  socialContainer: {
    alignItems: 'center',
  },
});