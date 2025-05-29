import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockAdoptionPets } from '../data/mockData';
import BottomNavbar from '../components/BottomNavbar';

export default function AdoptionListScreen({ setUser }) {
  const navigation = useNavigation();

  const renderPet = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AdoptionProcedure', { pet: item })}
    >
      <Image source={{ uri: item.image }} style={styles.petImage} />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetail}>{item.type} - {item.breed}</Text>
        <Text style={styles.petDetail}>Age: {item.age}</Text>
        <Text style={styles.petDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Pets Available for Adoption</Text>
        <FlatList
          data={mockAdoptionPets}
          renderItem={renderPet}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No pets available for adoption.</Text>}
        />
      </View>
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
    marginBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#2B3334',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#C7CCCC',
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2B3334',
  },
  petDetail: {
    fontSize: 12,
    color: '#485456',
  },
  petDescription: {
    fontSize: 12,
    color: '#485456',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#485456',
    textAlign: 'center',
    marginVertical: 20,
  },
});