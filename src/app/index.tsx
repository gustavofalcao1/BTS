// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './screens/Welcome';
import App from './App';
import { PermissionsAndroid, Platform, AppState, View, Text, ActivityIndicator, AppStateStatus } from 'react-native';

const Stack = createStackNavigator();

const Router = () => {
  const [isPermissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const bluetoothPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
          const locationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

          if (bluetoothPermission && locationPermission) {
            setPermissionsGranted(true);
          } else {
            setPermissionsGranted(false);
          }
        } catch (error) {
          console.warn(error);
          setPermissionsGranted(false);
        }
      } else {
        setPermissionsGranted(true);
      }
    };

    checkPermissions();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkPermissions();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  if (isPermissionsGranted === null) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isPermissionsGranted ? (
          <Stack.Screen name="App" component={App} />
        ) : (
          <Stack.Screen name="Welcome" component={Welcome} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
