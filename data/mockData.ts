export const mockUsers = [
  {
    id: 1,
    email: "user@example.com",
    username: "JohnDoe",
    password: "password123",
  },
];

export const mockPets = [
  {
    id: 1,
    userId: 1,
    name: "Max",
    species: "Dog",
    breed: "Labrador",
    age: 2,
    status: "available",
    description: "Friendly dog",
    location: { latitude: 37.7749, longitude: -122.4194 },
  },
  {
    id: 2,
    userId: 1,
    name: "Luna",
    species: "Cat",
    breed: "Persian",
    age: 1,
    status: "lost",
    description: "White fluffy cat",
    location: { latitude: 37.7849, longitude: -122.4294 },
  },
];
export const mockLostPets = [
  {
    id: 1,
    name: "Buddy",
    type: "Dog",
    breed: "Golden Retriever",
    location: "Central Park, NY",
    lastSeen: "2025-05-20",
    image: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Friendly dog, wearing a red collar, last seen near the park entrance."
  },
  {
    id: 2,
    name: "Whiskers",
    type: "Cat",
    breed: "Tabby",
    location: "Downtown, LA",
    lastSeen: "2025-05-19",
    image: "https://images.pexels.com/photos/32191657/pexels-photo-32191657/free-photo-of-close-up-of-a-calico-cat-resting-outdoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Shy cat with a white patch on chest, last seen near Main St."
  },
  {
    id: 3,
    name: "Max",
    type: "Dog",
    breed: "Beagle",
    location: "Riverside, CA",
    lastSeen: "2025-05-18",
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a",
    description: "Playful beagle, brown and white, missing from backyard."
  }
];

export const mockFoundPets = [
  {
    id: 4,
    name: "Unknown",
    type: "Cat",
    breed: "Siamese",
    location: "Suburban Area, TX",
    foundDate: "2025-05-21",
    image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
    description: "Found near a grocery store, very vocal and friendly."
  },
  {
    id: 5,
    name: "Unknown",
    type: "Dog",
    breed: "Labrador Mix",
    location: "Beachfront, FL",
    foundDate: "2025-05-20",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
    description: "Black lab mix, found wandering near the beach, no collar."
  }
];
// ../data/mockData.js
export const mockAdoptionPets = [
  {
    id: 1,
    userId: 1,
    name: 'Buddy',
    type: 'Dog',
    breed: 'Labrador',
    age: 3,
    description: 'Friendly and playful',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b',
    adoptionStatus: 'available',
  },
];