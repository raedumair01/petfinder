import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import BottomNavbar from '../components/BottomNavbar';

export default function AIRecognitionScreen({ setUser }) {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);

  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    try {
      const response = await ImagePicker.launchImageLibrary(options);
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri);
        setIsProcessing(true);
        // Simulate AI processing with a delay
        setTimeout(() => {
          setIsProcessing(false);
          setRecognitionResult({
            breed: 'Persian Cat',
            confidence: '95%',
            description: 'This pet matches a Persian Cat. Check the Lost Pets section for potential matches.',
          });
        }, 2000);
      }
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const handleCheckMatches = () => {
    // Simulate navigation to a lost pets screen
    navigation.navigate('LostPets'); // Replace with actual screen name
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 50}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>AI Animal Recognition</Text>
          <Text style={styles.subtitle}>Upload a photo to identify a lost pet</Text>

          {/* Image Upload Area */}
          <TouchableOpacity style={styles.uploadCard} onPress={handleImagePick}>
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.uploadImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadIcon}>📸🐾</Text>
                <Text style={styles.uploadText}>Tap to upload a pet photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Processing Indicator or Result */}
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#2E8B57" />
              <Text style={styles.processingText}>Analyzing your photo...</Text>
            </View>
          ) : recognitionResult ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Recognition Result</Text>
              <Text style={styles.resultDetail}>Breed: {recognitionResult.breed}</Text>
              <Text style={styles.resultDetail}>Confidence: {recognitionResult.confidence}</Text>
              <Text style={styles.resultDescription}>{recognitionResult.description}</Text>
              <TouchableOpacity style={styles.checkMatchesButton} onPress={handleCheckMatches}>
                <Text style={styles.buttonText}>Check Lost Pets</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.noResultText}>No photo uploaded yet.</Text>
          )}
        </View>
      </ScrollView>
      <BottomNavbar setUser={setUser} navigation={navigation} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFBFA',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Space for BottomNavbar
  },
  container: {
    flex: 1,
    padding: 20,
    borderWidth: 5,
    borderColor: '#B85B2F',
    borderRadius: 32,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#2B3334',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#485456',
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B4513',
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#2B3334',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  uploadImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  uploadIcon: {
    fontSize: 40,
    color: '#2E8B57',
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#485456',
    textAlign: 'center',
  },
  processingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  processingText: {
    fontSize: 14,
    color: '#2B3334',
    marginTop: 10,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B4513',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#2B3334',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B3334',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultDetail: {
    fontSize: 14,
    color: '#485456',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 12,
    color: '#485456',
    marginBottom: 12,
    textAlign: 'center',
  },
  checkMatchesButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#2E8B57',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noResultText: {
    fontSize: 14,
    color: '#6A7B7C',
    textAlign: 'center',
    marginVertical: 20,
  },
});