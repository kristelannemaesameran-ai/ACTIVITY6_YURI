
import React, { createContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

// Create a context for sharing plant information
const PlantContext = createContext();

// Sample plant collection
const plants = [
  { id: '1', name: 'Snake Plant', watered: false },
  { id: '2', name: 'Peace Lily', watered: false },
  { id: '3', name: 'Aloe Vera', watered: true },
];

// Provider makes plant information available to child components
function PlantProvider({ children }) {
  return (
    <PlantContext.Provider value={{ plants }}>
      {children}
    </PlantContext.Provider>
  );
}

// Main plant collection screen
function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlantCare</Text>
      <Text style={styles.subtitle}>My Plant Collection</Text>

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.plantName}>{item.name}</Text>
            <Text style={styles.status}>
              {item.watered ? '💧 Watered' : '🌵 Needs Water'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

// Wrap the application with the Provider
export default function App() {
  return (
    <PlantProvider>
      <HomeTab />
    </PlantProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
  },
  plantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  status: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
  },
});
