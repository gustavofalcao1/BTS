import React, { useEffect } from 'react';
import { Button, TouchableOpacity, View, Linking, Platform } from 'react-native';
import { Container, Scroll, Text, DeviceItem, DeviceText, ErrorText } from '../theme/global';
import { useBluetooth } from './hooks/useBluetooth';
import { useLocation } from './hooks/useLocation';
import { requestBluetoothPermissions } from './utils/requestPermissions';

const App = () => {
  const { devices, errorMsg: bluetoothErrorMsg, selectedDevice, handleDeviceClick, fetchConnectedDevices } = useBluetooth();
  const { location, errorMsg: locationErrorMsg } = useLocation();

  useEffect(() => {
    requestBluetoothPermissions();
  }, []);

  const openMap = (latitude: number, longitude: number) => {
    const url = `https://www.bing.com/maps?q=${latitude},${longitude}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url).catch((err) => console.error('Error opening the URL:', err));
      } else {
        console.error('It is not possible to open the URL.');
      }
    }).catch((err) => console.error('Error when checking the URL:', err));
  };

  return (
    <Container>
      {locationErrorMsg && <ErrorText>{locationErrorMsg}</ErrorText>}
      {bluetoothErrorMsg && <ErrorText>{bluetoothErrorMsg}</ErrorText>}
      {location && (
        <Text>
          Current location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
      )}

      <Button title="Update Devices" onPress={fetchConnectedDevices} />

      <Text>Known Bluetooth devices:</Text>
      <Scroll>
        {devices.length > 0 ? (
          devices.map((device, index) => (
            <TouchableOpacity key={index} onPress={() => handleDeviceClick(device)}>
              <DeviceItem>
                <DeviceText>Name: {device.name}</DeviceText>
                <DeviceText>ID: {device.id}</DeviceText>
                <DeviceText>
                  Status: {device.connected ? 'Connected' : 'Offline'}
                </DeviceText>
              </DeviceItem>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No known device found.</Text>
        )}
      </Scroll>

      {selectedDevice && (
        <View>
          <Text>Selected device:</Text>
          <Text>Name: {selectedDevice.name}</Text>
          <Text>ID: {selectedDevice.id}</Text>
          <Text>
            Status: {selectedDevice.connected ? 'Connected' : 'Offline'}
          </Text>
          {'location' in selectedDevice && selectedDevice.location ? (
            <>
              <Text>
                Last location: {selectedDevice.location.latitude.toFixed(6)}, {selectedDevice.location.longitude.toFixed(6)}
              </Text>
              {selectedDevice.timestamp && (
                <Text>
                  Date of last location: {selectedDevice.timestamp.toLocaleString()}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (selectedDevice.location) {
                    openMap(selectedDevice.location.latitude, selectedDevice.location.longitude);
                  }
                }}
              >
                <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Open no map</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>No location registered.</Text>
          )}
        </View>
      )}
    </Container>
  );
};

export default App;
