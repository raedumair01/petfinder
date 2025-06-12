import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Dimensions, PermissionsAndroid, Platform, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import BottomNavbar from '../components/BottomNavbar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [taglineIndex, setTaglineIndex] = useState(0);

  const taglines = [
    'Lost a pet? Our AI can help!',
    'Identify breeds in seconds!',
    'Find matches for lost pets instantly!',
  ];

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'We need your location to find nearby pets and services.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getLocation();
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getLocation();
      }
    };

    requestLocationPermission();

    // Rotate taglines every 3 seconds
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const featuredPets = [
    {
      id: '1',
      name: 'Bella',
      type: 'Dog',
      breed: 'Labrador',
      age: '2 years',
      location: 'Agege, Nigeria',
      days: '7 days ago',
      image: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '2',
      name: 'Teaser',
      type: 'Cat',
      breed: 'Persian',
      age: '1 year',
      location: 'Lagos, Nigeria',
      days: '3 days ago',
      image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: '3',
      name: 'Max',
      type: 'Dog',
      breed: 'German Shepherd',
      age: '3 years',
      location: 'Abuja, Nigeria',
      days: '10 days ago',
      image: 'https://images.pexels.com/photos/3726314/pexels-photo-3726314.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  const featuredItems = [
    { title: 'Pet Care Tip', text: 'Regular grooming reduces shedding!', screen: 'EducationalResources' },
    { title: 'Deal of the Day', text: '20% off Dog Toys!', screen: 'PetStore' },
  ];

  const filteredPets = featuredPets.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPetItem = ({ item }) => (
    <TouchableOpacity style={styles.petCard} onPress={() => navigation.navigate('AdoptionList')}>
      <Image
        source={{ uri: item.image }}
        style={styles.petImage}
        resizeMode="cover"
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetail}>Type: {item.type}</Text>
        <Text style={styles.petDetail}>Breed: {item.breed}</Text>
        <Text style={styles.petDetail}>Age: {item.age}</Text>
        <Text style={styles.petDetail}>Location: {item.location}</Text>
        <Text style={styles.petDetail}>Posted: {item.days}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.adoptButton]}
            onPress={() => navigation.navigate('adoptpro', { pet: item })}
          >
            <Text style={styles.buttonText}>Adopt Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={() => navigation.navigate('Social', { pet: item })}
          >
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Text style={styles.sectionTitle}>{item.title}</Text>
      <Text style={styles.featuredText}>{item.text}</Text>
      <Text style={styles.featuredLink}>See More</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Welcome Header */}
        <View style={styles.welcomeHeader}>
          <Text style={styles.welcomeText}>Welcome to Pet Finder App</Text>
        </View>

        {/* Search Bar with Location Icon */}
        <View style={styles.searchBar}>
          <Text style={styles.locationIcon}>📍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={location ? `Near ${location.latitude}, ${location.longitude}` : 'Searching location...'}
            placeholderTextColor="#696969"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* AI Recognition Section */}
        <TouchableOpacity
          style={styles.aiSection}
          onPress={() => navigation.navigate('Ai')}
        >
          <View style={styles.aiCard}>
            <View style={styles.aiIconContainer}>
              <Text style={styles.aiIcon}>📸🐾</Text>
            </View>
            <Text style={styles.aiTitle}>Identify a Lost Pet Through Ai Recognition</Text>
            <Text style={styles.aiTagline}>{taglines[taglineIndex]}</Text>
            <TouchableOpacity style={styles.aiLearnMore}>
              <Text style={styles.aiLearnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Featured Pets Section */}
        <View style={styles.featuredPetsSection}>
          <Text style={styles.sectionTitle}>Featured Pets for Adoption</Text>
          <FlatList
            data={filteredPets}
            renderItem={renderPetItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.emptyText}>No pets found.</Text>}
          />
        </View>

        {/* Featured Content Slider */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Content</Text>
          <FlatList
            horizontal
            data={featuredItems}
            renderItem={renderFeaturedItem}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>
        <View style={styles.spacer} />
      </ScrollView>
      <BottomNavbar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingBottom: 80,
  },
  welcomeHeader: {
    padding: 16,
    backgroundColor: '#8B4513',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 5,
    borderWidth: 2,
    borderColor: '#8B4513',
    borderRadius: 16,
    backgroundColor: '#FFF0F5',
    marginBottom: 10,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#8B4513',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#2B3334',
  },
  aiSection: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  aiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#8B4513',
    shadowColor: '#2B3334',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  aiIconContainer: {
    backgroundColor: '#2E8B57',
    borderRadius: 50,
    padding: 10,
    marginBottom: 12,
  },
  aiIcon: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B3334',
    marginBottom: 8,
    textAlign: 'center',
  },
  aiTagline: {
    fontSize: 14,
    color: '#485456',
    textAlign: 'center',
    marginBottom: 12,
  },
  aiLearnMore: {
    padding: 8,
  },
  aiLearnMoreText: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
  },
  featuredPetsSection: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 8,
  },
  petCard: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
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
    borderRadius: 5,
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
  emptyText: {
    fontSize: 15,
    color: '#6A7B7C',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    height: 40,
    backgroundColor: '#8B4513',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  adoptButton: {
    flex: 1,
    marginRight: 5,
  },
  shareButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#2E8B57',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  featuredSection: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  featuredList: {
    paddingVertical: 10,
  },
  featuredCard: {
    backgroundColor: '#E6E6FA',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#8B4513',
    width: width - 32,
    marginRight: 10,
  },
  featuredText: {
    color: '#483D8B',
    fontSize: 16,
  },
  featuredLink: {
    color: '#8B4513',
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
  },
  spacer: {
    height: 20,
  },
});