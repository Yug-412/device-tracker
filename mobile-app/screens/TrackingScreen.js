import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  requestTrackingPermission,
  startBackgroundTracking,
  stopBackgroundTracking,
} from '../services/locationService';

const TrackingScreen = ({ metadata, onStop }) => {
  const [active, setActive] = useState(false);

  const enableTracking = async () => {
    try {
      await requestTrackingPermission();
      await startBackgroundTracking(metadata);
      setActive(true);
      Alert.alert('Tracking started', 'Location updates are now sent every 5 seconds.');
    } catch (error) {
      Alert.alert('Permission required', error.message);
    }
  };

  const disableTracking = async () => {
    await stopBackgroundTracking(metadata.deviceId);
    setActive(false);
    onStop();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking Screen</Text>
      <Text style={styles.meta}>Driver: {metadata.driverName}</Text>
      <Text style={styles.meta}>Vehicle: {metadata.vehicleName}</Text>
      <Text style={styles.meta}>Device ID: {metadata.deviceId}</Text>

      {!active ? (
        <Pressable style={styles.primaryButton} onPress={enableTracking}>
          <Text style={styles.primaryText}>Allow permission and start tracking</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.stopButton} onPress={disableTracking}>
          <Text style={styles.stopText}>Stop tracking</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  meta: { marginBottom: 8, color: '#334155' },
  primaryButton: { backgroundColor: '#1d4ed8', borderRadius: 8, padding: 14, marginTop: 18 },
  primaryText: { color: 'white', textAlign: 'center', fontWeight: '700' },
  stopButton: { backgroundColor: '#dc2626', borderRadius: 8, padding: 14, marginTop: 18 },
  stopText: { color: 'white', textAlign: 'center', fontWeight: '700' },
});

export default TrackingScreen;
