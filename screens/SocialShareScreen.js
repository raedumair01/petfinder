import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Share from 'react-native-share';
import BottomNavbar from '../components/BottomNavbar';

export default function SocialShareScreen({ setUser }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { pet } = route.params || {};

  const handleShare = async (platform) => {
    if (!pet) {
      Alert.alert('Error', 'No pet selected to share.');
      return;
    }

    const shareOptions = {
      title: `Meet ${pet.name}!`,
      message: `Check out ${pet.name}, a ${pet.age} ${pet.breed} ${pet.type} available for adoption in ${pet.location}!`,
      url: pet.image, // Share the pet's image URL
      social: Share.Social[platform.toUpperCase()], // Map to Share.Social.FACEBOOK, TWITTER, etc.
    };

    try {
      await Share.open(shareOptions);
      Alert.alert('Success', `Shared ${pet.name}'s listing on ${platform}!`);
    } catch (error) {
      if (error.message !== 'User did not share') {
        Alert.alert('Error', `Failed to share on ${platform}.`);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 50}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Share Pet Listing</Text>
          {pet ? (
            <View style={styles.petCard}>
              <Image
                source={{ uri: pet.image }}
                style={styles.petImage}
                resizeMode="cover"
              />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petDetail}>Type: {pet.type}</Text>
                <Text style={styles.petDetail}>Breed: {pet.breed}</Text>
                <Text style={styles.petDetail}>Age: {pet.age}</Text>
                <Text style={styles.petDetail}>Location: {pet.location}</Text>
                <Text style={styles.petDetail}>Posted: {pet.days}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noPetText}>No pet selected to share.</Text>
          )}
          <View style={styles.shareButtons}>
            <TouchableOpacity
              style={[styles.button, styles.facebookButton]}
              onPress={() => handleShare('Facebook')}
            >
              <Text style={styles.buttonText}>Share on Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.twitterButton]}
              onPress={() => handleShare('Twitter')}
            >
              <Text style={styles.buttonText}>Share on Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.instagramButton]}
              onPress={() => handleShare('Instagram')}
            >
              <Text style={styles.buttonText}>Share on Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.whatsappButton]}
              onPress={() => handleShare('WhatsApp')}
            >
              <Text style={styles.buttonText}>Share on WhatsApp</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8B4513',
    shadowColor: '#2B3334',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B3334',
    marginBottom: 4,
  },
  petDetail: {
    fontSize: 13,
    color: '#485456',
    marginBottom: 2,
  },
  noPetText: {
    fontSize: 16,
    color: '#6A7B7C',
    textAlign: 'center',
    marginBottom: 20,
  },
  shareButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  facebookButton: {
    backgroundColor: '#3B5998', // Facebook blue
  },
  twitterButton: {
    backgroundColor: '#1DA1F2', // Twitter blue
  },
  instagramButton: {
    backgroundColor: '#E1306C', // Instagram pink
  },
  whatsappButton: {
    backgroundColor: '#25D366', // WhatsApp green
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});