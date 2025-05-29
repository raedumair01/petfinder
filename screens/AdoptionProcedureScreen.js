import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavbar from '../components/BottomNavbar';

export default function AdoptionProcedureScreen({ route, setUser }) {
  const { pet } = route.params;
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleAdoptionRequest = () => {
    if (!message) {
      Alert.alert('Error', 'Please provide a message');
      return;
    }

    Alert.alert('Success', `Adoption request for ${pet.name} submitted!`);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Adopt {pet.name}</Text>
        <Text style={styles.subtitle}>Steps to Adopt:</Text>
        <Text style={styles.step}>1. Submit your request with a message.</Text>
        <Text style={styles.step}>2. The owner will contact you within 48 hours.</Text>
        <Text style={styles.step}>3. Arrange a meeting to finalize the adoption.</Text>
        <Text style={styles.step}>4. Complete a background check if required.</Text>
        <Text style={styles.step}>5. Sign the adoption agreement.</Text>
        <Text style={styles.step}>6. Make the adoption fee payment.</Text>
        <Text style={styles.step}>7. Take your new pet home and schedule a follow-up visit.</Text>
        <Text style={styles.label}>Message to Owner</Text>
        <TextInput
          style={styles.input}
          placeholder="Why would you like to adopt this pet?"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleAdoptionRequest}>
          <Text style={styles.buttonText}>Submit Request</Text>
        </TouchableOpacity>
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
    borderWidth: 5,
    borderColor: '#B85B2F',
    borderRadius: 32,
  },
  contentContainer: {
    paddingBottom: 20, // Ensures space at the bottom for scrolling
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#2B3334',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2B3334',
    marginBottom: 10,
  },
  step: {
    fontSize: 14,
    color: '#485456',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: '#2B3334',
    marginTop: 20,
    marginBottom: 5,
  },
  input: {
    height: 100,
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
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});