import { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import TrackingScreen from './screens/TrackingScreen';

const App = () => {
  const [session, setSession] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {!session ? (
        <LoginScreen onLogin={setSession} />
      ) : (
        <TrackingScreen metadata={session} onStop={() => setSession(null)} />
      )}
    </SafeAreaView>
  );
};

export default App;
