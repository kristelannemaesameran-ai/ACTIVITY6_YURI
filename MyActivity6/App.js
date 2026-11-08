
import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const PlantContext = createContext();
const Tab = createBottomTabNavigator();

// Manage shared plant information
function PlantProvider({ children }) {
  const [plants, setPlants] = useState([
    { id: '1', name: 'Snake Plant', watered: false },
    { id: '2', name: 'Peace Lily', watered: false },
    { id: '3', name: 'Aloe Vera', watered: true },
  ]);

  const [loading, setLoading] = useState(false);

  // Update watering status with a short saving delay
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

// First tab: Display the plant collection
function HomeTab() {
  const { plants, loading } = useContext(PlantContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 My Plant Collection</Text>
      <Text style={styles.subtitle}>Your plants in one place</Text>

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

// Second tab: Manage plant care
function CareTab() {
  const { plants, waterPlant, loading } = useContext(PlantContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💧 Plant Care Center</Text>
      <Text style={styles.subtitle}>Manage your watering activities</Text>

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

// Main application with two bottom navigation tabs
export default function App() {
  return (
    <PlantProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#2E7D32' },
            headerTintColor: '#FFFFFF',
            tabBarActiveTintColor: '#2E7D32',
            tabBarInactiveTintColor: '#888888',
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeTab}
            options={{
              title: 'PlantCare',
              tabBarLabel: 'My Plants',
            }}
          />

          <Tab.Screen
            name="Care"
            component={CareTab}
            options={{
              title: 'Plant Care',
              tabBarLabel: 'Care',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PlantProvider>
  );
}

// Application styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 15,
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
    color: '#666666',
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
