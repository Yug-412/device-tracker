import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehicleName, setVehicleName] = useState('');

  const submit = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onLogin({ deviceId: deviceId.trim(), driverName: driverName.trim(), vehicleName: vehicleName.trim() });
    } catch (error) {
      Alert.alert('Login failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Login</Text>
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Device ID" value={deviceId} onChangeText={setDeviceId} />
      <TextInput style={styles.input} placeholder="Driver Name" value={driverName} onChangeText={setDriverName} />
      <TextInput style={styles.input} placeholder="Vehicle Name" value={vehicleName} onChangeText={setVehicleName} />
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  button: { backgroundColor: '#1d4ed8', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default LoginScreen;
