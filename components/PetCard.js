import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function PetCard({ pet }) {
  return (
    <View style={styles.card}>
      {pet.image && <Image source={{ uri: pet.image }} style={styles.image} />}
      <View style={styles.details}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.info}>Type: {pet.type}</Text>
        <Text style={styles.info}>Age: {pet.age}</Text>
        <Text style={styles.info}>Status: {pet.status}</Text>
        <Text style={styles.description}>{pet.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7CCCC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2B3334',
    marginBottom: 5,
  },
  info: {
    fontSize: 12,
    color: '#485456',
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    color: '#485456',
    marginTop: 5,
  },
});