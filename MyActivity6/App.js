
import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Create context for sharing plant information
const PlantContext = createContext();

// Create bottom tab navigation
const Tab = createBottomTabNavigator();

// Manage shared plant information
function PlantProvider({ children }) {
  const [plants, setPlants] = useState([
    { id: '1', name: 'Snake Plant', watered: false },
    { id: '2', name: 'Peace Lily', watered: false },
    { id: '3', name: 'Aloe Vera', watered: true },
    { id: '4', name: 'Spider Plant', watered: false },
  ]);

  const [wateringId, setWateringId] = useState(null);

  // Update the watering status of a plant
  const waterPlant = (id) => {
    if (wateringId !== null) return;

    setWateringId(id);

    setTimeout(() => {
      setPlants((currentPlants) =>
        currentPlants.map((plant) =>
          plant.id === id
            ? { ...plant, watered: !plant.watered }
            : plant
        )
      );

      setWateringId(null);
    }, 800);
  };

  // Share plant data with both screens
  return (
    <PlantContext.Provider
      value={{ plants, waterPlant, wateringId }}
    >
      {children}
    </PlantContext.Provider>
  );
}

// Home tab displays plant information
function HomeTab() {
  const { plants } = useContext(PlantContext);

  // Calculate plant statistics
  const totalPlants = plants.length;
  const wateredPlants = plants.filter((plant) => plant.watered).length;
  const needsWater = totalPlants - wateredPlants;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen heading */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.title}>PlantCare 🌿</Text>
          <Text style={styles.subtitle}>
            Take care of your plants every day.
          </Text>
        </View>

        {/* Plant statistics */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Plant Summary</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalPlants}</Text>
              <Text style={styles.statLabel}>Total Plants</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{wateredPlants}</Text>
              <Text style={styles.statLabel}>Watered</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{needsWater}</Text>
              <Text style={styles.statLabel}>Need Water</Text>
            </View>
          </View>
        </View>

        {/* Display all plants */}
        <Text style={styles.sectionTitle}>My Plant Collection</Text>

        {plants.map((plant) => (
          <View key={plant.id} style={styles.plantCard}>
            <View style={styles.plantInfo}>
              <View style={styles.plantIcon}>
                <Ionicons name="leaf" size={25} color="#E75480" />
              </View>

              <View style={styles.plantDetails}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text
                  style={[
                    styles.statusText,
                    { color: plant.watered ? '#269B72' : '#D6336C' },
                  ]}
                >
                  {plant.watered ? 'Watered' : 'Needs Water'}
                </Text>
              </View>
            </View>

            <Ionicons
              name={plant.watered ? 'checkmark-circle' : 'alert-circle'}
              size={24}
              color={plant.watered ? '#269B72' : '#E75480'}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Care tab allows users to update plant status
function CareTab() {
  const { plants, waterPlant, wateringId } = useContext(PlantContext);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen heading */}
        <View style={styles.header}>
          <Text style={styles.title}>Plant Care 💧</Text>
          <Text style={styles.subtitle}>
            Keep your plants healthy and happy.
          </Text>
        </View>

        {/* Show watering instructions */}
        <View style={styles.infoCard}>
          <Ionicons name="water" size={30} color="#E75480" />
          <Text style={styles.infoTitle}>Daily Plant Care</Text>
          <Text style={styles.infoText}>
            Check your plants and update their watering status below.
          </Text>
        </View>

        {/* Display plant care buttons */}
        <Text style={styles.sectionTitle}>Manage Your Plants</Text>

        {plants.map((plant) => {
          const isLoading = wateringId === plant.id;

          return (
            <View key={plant.id} style={styles.careCard}>
              <View style={styles.careHeader}>
                <View style={styles.plantIcon}>
                  <Ionicons name="leaf" size={25} color="#E75480" />
                </View>

                <View style={styles.plantDetails}>
                  <Text style={styles.plantName}>{plant.name}</Text>
                  <Text style={styles.careStatus}>
                    {plant.watered ? 'Already watered' : 'Needs watering'}
                  </Text>
                </View>
              </View>

              {/* Button updates the plant status */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  plant.watered && styles.wateredButton,
                ]}
                onPress={() => waterPlant(plant.id)}
                disabled={wateringId !== null}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    {plant.watered ? 'Mark as Needs Water' : 'Water Plant'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        <Text style={styles.footerText}>
          Small care makes a big difference! 🌱
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Main application
export default function App() {
  return (
    <SafeAreaProvider>
      <PlantProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#FFF0F5" />

          {/* Bottom tab navigation */}
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: '#E75480',
              tabBarInactiveTintColor: '#B88A9B',
              tabBarLabelStyle: {
                fontWeight: '600',
                fontSize: 12,
              },
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopColor: '#F8D7E3',
                paddingTop: 8,
              },
              tabBarIcon: ({ color, size }) => {
                const iconName =
                  route.name === 'Home' ? 'home' : 'water';

                return (
                  <Ionicons name={iconName} size={size} color={color} />
                );
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeTab} />
            <Tab.Screen name="Care" component={CareTab} />
          </Tab.Navigator>
        </NavigationContainer>
      </PlantProvider>
    </SafeAreaProvider>
  );
}

// Application styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },

  screen: {
    flex: 1,
  },

  // Allow content to grow and scroll on smaller screens
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 45,
  },

  header: {
    marginBottom: 22,
  },

  greeting: {
    fontSize: 16,
    color: '#A65D79',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#D6336C',
    marginTop: 4,
  },

  subtitle: {
    fontSize: 14,
    color: '#9B7182',
    marginTop: 6,
  },

  statsCard: {
    backgroundColor: '#E75480',
    padding: 20,
    borderRadius: 22,
    marginBottom: 25,
  },

  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 18,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  statNumber: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  statLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#B52D60',
    marginBottom: 14,
  },

  plantCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },

  plantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  plantIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFE4ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  plantDetails: {
    flex: 1,
  },

  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#74354E',
  },

  statusText: {
    fontSize: 13,
    marginTop: 5,
    fontWeight: '600',
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 2,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B52D60',
    marginTop: 10,
  },

  infoText: {
    fontSize: 13,
    color: '#9B7182',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },

  careCard: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 2,
  },

  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  careStatus: {
    fontSize: 13,
    color: '#9B7182',
    marginTop: 5,
  },

  actionButton: {
    backgroundColor: '#E75480',
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  wateredButton: {
    backgroundColor: '#B86B89',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  footerText: {
    textAlign: 'center',
    color: '#B07890',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 5,
  },
});
