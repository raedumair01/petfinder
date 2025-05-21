import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen({ users = [], setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // const user = users.find((u) => u.email === email && u.password === password);
    // if (!user) {
    //   Alert.alert('Error', 'Invalid email or password');
    //   return;
    // }

    // setUser(user);
    Alert.alert('Success', 'Logged in successfully!');
    // navigation.navigate('Profile');

    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}></Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.signupLinkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.socialContainer}>
        <View style={styles.orLine}>
          <View style={styles.line} />
          <Text style={styles.orText}>oo</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.socialIcons}>
          <View style={styles.socialIcon}>
            <Text style={styles.iconText}>G</Text>
          </View>
          <View style={styles.socialIcon}>
            <Text style={styles.iconText}>F</Text>
          </View>
        </View>
      </View> */}
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
    marginBottom: 380, // Reduced from 400 to 20 for proper alignment
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#B85B2F',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signupLinkContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    paddingTop: 10,
    fontSize: 14,
    color: '#262631',
  },
  socialContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  orLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#787879',
  },
  orText: {
    fontSize: 12,
    color: '#444246',
    marginHorizontal: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
  },
  socialIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#DDD', // Placeholder color
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
    color: '#000',
  },
});