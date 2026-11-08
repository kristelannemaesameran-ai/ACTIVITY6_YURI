
import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const PlantContext = createContext();

function PlantProvider({ children }) {
  const [plants, setPlants] = useState([
    { id: '1', name: 'Snake Plant', watered: false },
    { id: '2', name: 'Peace Lily', watered: false },
    { id: '3', name: 'Aloe Vera', watered: true },
  ]);

  const [loading, setLoading] = useState(false);

  // Simulate saving a plant update
  const waterPlant = (id) => {
    if (loading) return;

    setLoading(true);

    setTimeout(() => {
      setPlants((previousPlants) =>
        previousPlants.map((plant) =>
          plant.id === id
            ? { ...plant, watered: !plant.watered }
            : plant
        )
      );

      setLoading(false);
    }, 1000);
  };

  return (
    <PlantContext.Provider value={{ plants, waterPlant, loading }}>
      {children}
    </PlantContext.Provider>
  );
}

function HomeTab() {
  const { plants, loading } = useContext(PlantContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 My Plant Collection</Text>

      {loading && (
        <Text style={styles.loading}>Updating plant information...</Text>
      )}

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

function CareTab() {
  const { plants, waterPlant, loading } = useContext(PlantContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💧 Plant Care Center</Text>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loading}>Saving changes...</Text>
        </View>
      )}

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.plantName}>{item.name}</Text>
            <Text style={styles.status}>
              {item.watered ? 'Already Watered' : 'Needs Water'}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => waterPlant(item.id)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {item.watered ? 'Mark as Needs Water' : 'Water Plant'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default function App() {
  return (
    <PlantProvider>
      <View style={{ flex: 1 }}>
        <HomeTab />
        <CareTab />
      </View>
    </PlantProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
  },
  plantName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  status: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  loading: {
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 8,
  },
});
