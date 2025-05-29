import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavbar from '../components/BottomNavbar';

const EducationalResourcesScreen = () => {
  const navigation = useNavigation();

  const resources = [
    {
      id: '1',
      title: 'Puppy Training 101',
      description: 'Learn the basics of training your new puppy with positive reinforcement techniques.',
      category: 'Training',
      days: '7 days ago',
      image: 'https://images.pexels.com/photos/3726314/pexels-photo-3726314.jpeg?auto=compress&cs=tinysrgb&w=600', // Puppy image
    },
    {
      id: '2',
      title: 'Cat Health Basics',
      description: 'Essential tips for maintaining your cat\'s health and well-being.',
      category: 'Care',
      days: '3 days ago',
      image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=600', // Cat image
    },
    {
      id: '3',
      title: 'Dog Nutrition Guide',
      description: 'Understand the best diet for your dog based on age and activity level.',
      category: 'Nutrition',
      days: '10 days ago',
      image: 'https://images.pexels.com/photos/2255989/pexels-photo-2255989.jpeg?auto=compress&cs=tinysrgb&w=600', // Dog image
    },
  ];

  const renderResourceItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.resourceImage}
        resizeMode="cover"
      />
      <View style={styles.resourceInfo}>
        <Text style={styles.resourceName}>{item.title}</Text>
        <Text style={styles.resourceDetail}>Category: {item.category}</Text>
        <Text style={styles.resourceDetail}>Posted: {item.days}</Text>
        <Text style={styles.resourceDescription}>{item.description}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Read More</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Educational Resources</Text>
        <FlatList
          data={resources}
          renderItem={renderResourceItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No resources found.</Text>}
        />
      </View>
      <BottomNavbar />
    </View>
  );
};

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
  card: {
    flexDirection: 'column', // Stack image and text vertically
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
  resourceImage: {
    width: '100%', // Full width of the card
    height: 200, // Larger image height
    borderRadius: 12,
    marginBottom: 12, // Space between image and text
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B3334', // Dark teal for emphasis
    marginBottom: 4,
  },
  resourceDetail: {
    fontSize: 13,
    color: '#485456', // Muted teal for details
    marginBottom: 2,
  },
  resourceDescription: {
    fontSize: 12,
    color: '#6A7B7C', // Slightly lighter muted teal
    marginTop: 6,
    marginBottom: 10,
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 15,
    color: '#6A7B7C',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    width: '50%',
    height: 40,
    backgroundColor: '#B85B2F', // Terracotta for "Read More" button
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default EducationalResourcesScreen;