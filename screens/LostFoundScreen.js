import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockLostPets, mockFoundPets } from '../data/mockData';
import BottomNavbar from '../components/BottomNavbar';

export default function LostFoundScreen({ setUser }) {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('All'); // State for filter: All, Lost, Found

  // Combine and filter pet data based on selection
  const allPets = [...mockLostPets, ...mockFoundPets];
  const filteredPets = filter === 'All' 
    ? allPets 
    : filter === 'Lost' 
      ? mockLostPets 
      : mockFoundPets;

  const renderPet = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.petImage} 
        resizeMode="cover"
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetail}>{item.type} - {item.breed}</Text>
        <Text style={styles.petDetail}>Location: {item.location}</Text>
        <Text style={styles.petDetail}>
          {item.lastSeen ? `Last Seen: ${item.lastSeen}` : `Found: ${item.foundDate}`}
        </Text>
        <Text style={styles.petDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Lost and Found Pets</Text>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'All' && styles.activeFilter]}
            onPress={() => setFilter('All')}
          >
            <Text style={[styles.filterText, filter === 'All' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'Lost' && styles.activeFilter]}
            onPress={() => setFilter('Lost')}
          >
            <Text style={[styles.filterText, filter === 'Lost' && styles.activeFilterText]}>
              Lost
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'Found' && styles.activeFilter]}
            onPress={() => setFilter('Found')}
          >
            <Text style={[styles.filterText, filter === 'Found' && styles.activeFilterText]}>
              Found
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pet List */}
        <FlatList
          data={filteredPets}
          renderItem={renderPet}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No pets found.</Text>}
        />

        {/* Report Lost Pet Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FAAD14' }]}
          onPress={() => navigation.navigate('LostPetForm')}
        >
          <Text style={styles.buttonText}>Report Lost Pet</Text>
        </TouchableOpacity>
      </View>
      <BottomNavbar setUser={setUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFBFA', // Warm off-white background
  },
  container: {
    flex: 1,
    padding: 20,
    borderWidth: 0,
    borderColor: '#B85B2F', // Warm terracotta border
    borderRadius: 24,
    marginBottom: 60,
    backgroundColor: '#FFF8F2', // Slightly warmer container background
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2B3334', // Dark teal for emphasis
    marginBottom: 15,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E8EDEB', // Light gray for inactive filter
    borderWidth: 1,
    borderColor: '#C7CCCC',
  },
  activeFilter: {
    backgroundColor: '#B85B2F', // Terracotta for active filter
    borderColor: '#9A4A25',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#485456', // Muted teal for text
  },
  activeFilterText: {
    color: '#FFFBFA', // Off-white for active filter text
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D9E0E0', // Softer border color
    shadowColor: '#2B3334',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  petImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
    alignSelf: 'flex-start', // Align image to top of card
  },
  petInfo: {
    flex: 1,
    justifyContent: 'center', // Center text vertically within card
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B3334', // Dark teal for emphasis
    marginBottom: 4,
  },
  petDetail: {
    fontSize: 13,
    color: '#485456', // Muted teal for details
    marginBottom: 2,
  },
  petDescription: {
    fontSize: 12,
    color: '#6A7B7C', // Slightly lighter muted teal
    marginTop: 6,
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 15,
    color: '#6A7B7C',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#FAAD14', // Yellow for "Report Lost Pet" (matches ProfileScreen)
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});