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