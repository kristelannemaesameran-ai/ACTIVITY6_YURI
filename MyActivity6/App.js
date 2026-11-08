
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Main PlantCare application
export default function App() {
  return (
    <View style={styles.container}>
      {/* Application title */}
      <Text style={styles.title}>PlantCare</Text>

      {/* Welcome message */}
      <Text style={styles.subtitle}>
        Welcome to your Smart Plant Companion!
      </Text>

      {/* First sample plant */}
      <View style={styles.card}>
        <Text style={styles.plantName}>🌿 Snake Plant</Text>
        <Text style={styles.status}>Needs Water</Text>
      </View>
    </View>
  );
}

// Basic application styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
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
