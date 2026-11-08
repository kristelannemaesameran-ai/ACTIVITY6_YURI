
import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Create context for sharing plant data
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

  const [loading, setLoading] = useState(false);

  // Update the watering status of a plant
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

  // Share plant data and functions with both tabs
  return (
    <PlantContext.Provider value={{ plants, waterPlant, loading }}>
      {children}
    </PlantContext.Provider>
  );
}

// Home tab displays all plants and their status
function HomeTab() {
  const { plants, loading } = useContext(PlantContext);

  // Calculate plant statistics
  const wateredCount = plants.filter((plant) => plant.watered).length;
  const needsWaterCount = plants.length - wateredCount;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#FFF0F5" barStyle="dark-content" />

      {/* Home screen heading */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🪴</Text>
        <Text style={styles.title}>PlantCare</Text>
        <Text style={styles.subtitle}>
          A little love makes plants grow
        </Text>
      </View>

      {/* Display plant statistics */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{plants.length}</Text>
          <Text style={styles.summaryLabel}>Total Plants</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{wateredCount}</Text>
          <Text style={styles.summaryLabel}>Watered</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{needsWaterCount}</Text>
          <Text style={styles.summaryLabel}>Need Water</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>My Plant Collection ♡</Text>

      {/* Show loading message when updating */}
      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#E75480" />
          <Text style={styles.loading}>Updating plant information...</Text>
        </View>
      )}

      {/* Display the shared plant collection */}
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.plantInfo}>
              <View style={styles.plantIconContainer}>
                <Text style={styles.plantIcon}>🪴</Text>
              </View>

              <View style={styles.plantDetails}>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text style={styles.plantNumber}>
                  Plant #{index + 1}
                </Text>
              </View>

              {/* Display the current watering status */}
              <View
                style={[
                  styles.statusBadge,
                  item.watered
                    ? styles.wateredBadge
                    : styles.needsWaterBadge,
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {item.watered ? 'Watered' : 'Needs Water'}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Care tab allows users to update plant status
function CareTab() {
  const { plants, waterPlant, loading } = useContext(PlantContext);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#FFF0F5" barStyle="dark-content" />

      {/* Care screen heading */}
      <View style={styles.header}>
        <Text style={styles.emoji}>💧</Text>
        <Text style={styles.title}>Plant Care Center</Text>
        <Text style={styles.subtitle}>
          Give your plants the care they deserve!
        </Text>
      </View>

      {/* Show loading indicator */}
      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#E75480" />
          <Text style={styles.loading}>Saving changes...</Text>
        </View>
      )}

      {/* Display plants with watering buttons */}
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.careCard}>
            <View style={styles.careHeader}>
              <Text style={styles.plantIcon}>🪴</Text>

              <View style={styles.plantDetails}>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text style={styles.plantNumber}>
                  Plant #{index + 1}
                </Text>
              </View>
            </View>

            {/* Show plant watering information */}
            <View style={styles.careStatus}>
              <Text style={styles.careStatusText}>
                {item.watered
                  ? '💧 This plant has been watered!'
                  : '🌱 This plant needs some water.'}
              </Text>
            </View>

            {/* Button updates the shared plant status */}
            <TouchableOpacity
              style={[
                styles.button,
                item.watered && styles.secondaryButton,
                loading && styles.disabledButton,
              ]}
              onPress={() => waterPlant(item.id)}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Ionicons
                name={item.watered ? 'refresh' : 'water'}
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.buttonText}>
                {item.watered ? 'Mark as Needs Water' : 'Water Plant'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Main application with bottom tab navigation
export default function App() {
  return (
    // Provide safe area and shared plant data
    <SafeAreaProvider>
      <PlantProvider>
        <NavigationContainer>

          {/* Configure Home and Care tabs */}
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: '#D6336C',
              tabBarInactiveTintColor: '#D88AA5',
              tabBarStyle: styles.tabBar,
              tabBarLabelStyle: styles.tabLabel,

              // Set icons for each tab
              tabBarIcon: ({ color, size, focused }) => {
                const icons = {
                  Home: focused ? 'leaf' : 'leaf-outline',
                  Care: focused ? 'water' : 'water-outline',
                };

                return (
                  <Ionicons
                    name={icons[route.name]}
                    size={size + 2}
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
    </SafeAreaProvider>
  );
}

// Pink theme and application styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 18,
  },

  header: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 18,
  },

  emoji: {
    fontSize: 42,
    marginBottom: 5,
  },

  title: {
    fontSize: 27,
    fontWeight: '900',
    color: '#D6336C',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 13,
    color: '#B84D75',
    marginTop: 5,
    textAlign: 'center',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 22,
    elevation: 4,
    shadowColor: '#D6336C',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryNumber: {
    fontSize: 25,
    fontWeight: '900',
    color: '#D6336C',
  },

  summaryLabel: {
    fontSize: 11,
    color: '#B84D75',
    marginTop: 5,
    textAlign: 'center',
  },

  summaryDivider: {
    width: 1,
    height: 35,
    backgroundColor: '#FFD6E5',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#C2185B',
    marginBottom: 10,
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginVertical: 7,
    elevation: 3,
    shadowColor: '#D6336C',
    shadowOpacity: 0.10,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
  },

  plantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  plantIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFE0EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  plantIcon: {
    fontSize: 28,
  },

  plantDetails: {
    flex: 1,
    marginLeft: 12,
  },

  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C2185B',
  },

  plantNumber: {
    fontSize: 11,
    color: '#D88AA5',
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  wateredBadge: {
    backgroundColor: '#FFD6E5',
  },

  needsWaterBadge: {
    backgroundColor: '#FFF0F5',
  },

  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#C2185B',
  },

  loadingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  loading: {
    color: '#D6336C',
    fontSize: 12,
    marginLeft: 8,
  },

  careCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#D6336C',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  careStatus: {
    backgroundColor: '#FFF0F5',
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
  },

  careStatusText: {
    fontSize: 13,
    color: '#B84D75',
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#E75480',
    padding: 14,
    borderRadius: 12,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  secondaryButton: {
    backgroundColor: '#D88AA5',
  },

  disabledButton: {
    opacity: 0.6,
  },

  tabBar: {
    backgroundColor: '#FFFFFF',
    height: 65,
    paddingBottom: 8,
    paddingTop: 5,
    borderTopColor: '#FFD6E5',
    borderTopWidth: 1,
    elevation: 10,
  },

  tabLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
