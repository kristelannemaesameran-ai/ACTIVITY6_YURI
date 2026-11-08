
import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const PlantContext = createContext();

function PlantProvider({ children }) {
  const [plants, setPlants] = useState([
    { id: '1', name: 'Snake Plant', watered: false },
    { id: '2', name: 'Peace Lily', watered: false },
    { id: '3', name: 'Aloe Vera', watered: true },
  ]);

  // Change the watering status of the selected plant
  const waterPlant = (id) => {
    setPlants((previousPlants) =>
      previousPlants.map((plant) =>
        plant.id === id
          ? { ...plant, watered: !plant.watered }
          : plant
      )
    );
  };

  return (
    <PlantContext.Provider value={{ plants, waterPlant }}>
      {children}
    </PlantContext.Provider>
  );
}

function HomeTab() {
  const { plants } = useContext(PlantContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 My Plant Collection</Text>

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
  const { plants, waterPlant } = useContext(PlantContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💧 Plant Care Center</Text>

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.plantName}>{item.name}</Text>
            <Text style={styles.status}>
              {item.watered ? 'Already Watered' : 'Needs Water'}
            </Text>

            {/* Update the selected plant */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => waterPlant(item.id)}
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
});
