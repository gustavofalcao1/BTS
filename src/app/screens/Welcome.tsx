import React from 'react';
import { Button, Platform, Linking, Alert } from 'react-native';
import { Container, Text, Title } from '../../theme/global';

const openSettings = () => {
  if (Platform.OS === 'android') {
    Linking.openSettings().catch(() => {
      Alert.alert('It was not possible to open the settings.');
    });
  } else {
    Alert.alert('Please go to the system settings to adjust permissions.');
  }
};

const Welcome = ({ navigation }: any) => {
  const handleSettingsPress = () => {
    openSettings();
    Alert.alert(
      'Permissions',
      'After granting the permissions, go back to the application to continue.',
      [{ text: 'OK', onPress: () => navigation.navigate('App') }]
    );
  };

  return (
    <Container>
      <Title>Welcome to BTS</Title>
      <Text style={{width: '95%'}}>
        To use all application features, you need to allow access to Bluetooth devices and your location. Please adjust these permissions manually in the settings of your device.
      </Text>
      <Button title="Open Settings" onPress={handleSettingsPress} />
    </Container>
  );
};

export default Welcome;
