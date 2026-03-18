import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  getStoredUser,
  requestLocationPermissions,
  saveUserProfile,
  startBackgroundTracking,
} from '@/src/services/locationTracking';

export default function HomeScreen() {
  const [nameInput, setNameInput] = useState('');
  const [userName, setUserName] = useState('');
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const user = await getStoredUser();
      if (user.userName) {
        setUserName(user.userName);
        setNameInput(user.userName);
      }
      setIsBootstrapping(false);
    };

    bootstrap();
  }, []);

  const startTracking = async (nameToSave: string) => {
    try {
      setIsSaving(true);
      const profile = await saveUserProfile(nameToSave);
      const granted = await requestLocationPermissions();
      setPermissionGranted(granted);

      if (!granted) {
        Alert.alert('Permission required', 'Foreground and background location permission are required.');
        return;
      }

      await startBackgroundTracking();
      setUserName(profile.userName);
    } finally {
      setIsSaving(false);
    }
  };

  const statusText = useMemo(() => {
    if (permissionGranted === null) return 'Waiting for permission request';
    return permissionGranted ? 'Tracking is active in background' : 'Location permission denied';
  }, [permissionGranted]);

  if (isBootstrapping) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.helperText}>Loading profile…</Text>
      </SafeAreaView>
    );
  }

  if (!userName) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to Device Tracker</Text>
          <Text style={styles.helperText}>Enter your name to start real-time GPS tracking.</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={nameInput}
            onChangeText={setNameInput}
            autoCapitalize="words"
            maxLength={50}
          />
          <Pressable
            style={[styles.button, (!nameInput.trim() || isSaving) && styles.buttonDisabled]}
            onPress={() => startTracking(nameInput)}
            disabled={!nameInput.trim() || isSaving}
          >
            <Text style={styles.buttonLabel}>{isSaving ? 'Starting…' : 'Start Tracking'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Hi, {userName}</Text>
        <Text style={styles.helperText}>{statusText}</Text>
        <Text style={styles.helperText}>The app sends updates every few seconds, even in background mode.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  helperText: {
    fontSize: 15,
    color: '#475569',
  },
  input: {
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
