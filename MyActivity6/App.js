
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
import { Ionicons } from '@expo/vector-icons';

// Create a context to share plant information
const PlantContext = createContext();

const Tab = createBottomTabNavigator();

// Provider manages the shared application data
function PlantProvider({ children }) {
  const [plants, setPlants] = useState([
    { id: '1', name: 'Snake Plant', watered: false },
    { id: '2', name: 'Peace Lily', watered: false },
    { id: '3', name: 'Aloe Vera', watered: true },
    { id: '4', name: 'Spider Plant', watered: false },
  ]);

  const [loading, setLoading] = useState(false);

  // Update a plant's watering status
  const waterPlant = (id) => {
    if (loading) return;

    setLoading(true);

    // Simulate a short saving process
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

// Home tab: Display the shared plant collection
function HomeTab() {
  const { plants, loading } = useContext(PlantContext);

  // Calculate plant watering statistics
  const wateredCount = plants.filter((plant) => plant.watered).length;
  const needsWaterCount = plants.length - wateredCount;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to</Text>
      <Text style={styles.title}>🌿 PlantCare</Text>

      <Text style={styles.subtitle}>
        Your Smart Plant Companion
      </Text>

      {/* Show a summary of plant conditions */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{plants.length}</Text>
          <Text style={styles.summaryLabel}>Total Plants</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{wateredCount}</Text>
          <Text style={styles.summaryLabel}>Watered</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{needsWaterCount}</Text>
          <Text style={styles.summaryLabel}>Need Water</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>My Plant Collection</Text>

      {loading && (
        <Text style={styles.loading}>Updating plant information...</Text>
      )}

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.plantInfo}>
              <Text style={styles.plantIcon}>🪴</Text>

              <View>
                <Text style={styles.plantName}>{item.name}</Text>

                <Text style={styles.status}>
                  {item.watered ? '💧 Watered' : '🌵 Needs Water'}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// Care tab: Update plant watering status
function CareTab() {
  const { plants, waterPlant, loading } = useContext(PlantContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💧 Plant Care Center</Text>

      <Text style={styles.subtitle}>
        Keep your plants healthy and happy!
      </Text>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loading}>Saving changes...</Text>
        </View>
      )}

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.plantName}>🪴 {item.name}</Text>

            <Text style={styles.status}>
              {item.watered
                ? '💧 This plant has been watered.'
                : '🌵 This plant needs water.'}
            </Text>

            {/* Update the shared plant information */}
            <TouchableOpacity
              style={[
                styles.button,
                item.watered && styles.secondaryButton,
              ]}
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

// Main app: Configure the two bottom navigation tabs
export default function App() {
  return (
    <PlantProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: {
              backgroundColor: '#2E7D32',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarActiveTintColor: '#2E7D32',
            tabBarInactiveTintColor: '#888888',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              height: 65,
              paddingBottom: 8,
              paddingTop: 5,
            },
            tabBarIcon: ({ color, size }) => {
              // Select an icon for each tab
              const icons = {
                Home: 'leaf',
                Care: 'water',
              };

              return (
                <Ionicons
                  name={icons[route.name]}
                  size={size}
                  color={color}
                />
              );
            },
          })}
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

// Styles for the PlantCare application
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 18,
  },
  welcome: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginTop: 15,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 12,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    elevation: 3,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 15,
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 13,
    marginVertical: 8,
    elevation: 3,
  },
  plantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  status: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 13,
    borderRadius: 9,
    marginTop: 15,
  },
  secondaryButton: {
    backgroundColor: '#78909C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  loading: {
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 8,
  },
});
