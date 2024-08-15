import React from 'react';
import { Button, ScrollView, TouchableOpacity, View, Linking, Platform } from 'react-native';
import { Container, Scroll, Text, DeviceItem, DeviceText, ErrorText } from '../theme/global';
import { useBluetooth } from './hooks/useBluetooth';
import { useLocation } from './hooks/useLocation';

const App = () => {
  const { devices, errorMsg: bluetoothErrorMsg, selectedDevice, handleDeviceClick, fetchConnectedDevices } = useBluetooth();
  const { location, errorMsg: locationErrorMsg } = useLocation();

  const openMap = (latitude: number, longitude: number) => {
    const url = `https://www.bing.com/maps?q=${latitude},${longitude}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url).catch((err) => console.error('Erro ao abrir o URL:', err));
      } else {
        console.error('Não é possível abrir o URL.');
      }
    }).catch((err) => console.error('Erro ao verificar o URL:', err));
  };

  return (
    <Container>
      {locationErrorMsg && <ErrorText>{locationErrorMsg}</ErrorText>}
      {bluetoothErrorMsg && <ErrorText>{bluetoothErrorMsg}</ErrorText>}
      {location && (
        <Text>
          Localização atual: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
      )}

      <Button title="Atualizar Dispositivos" onPress={fetchConnectedDevices} />

      <Text>Dispositivos Bluetooth conhecidos:</Text>
      <Scroll>
        {devices.length > 0 ? (
          devices.map((device, index) => (
            <TouchableOpacity key={index} onPress={() => handleDeviceClick(device)}>
              <DeviceItem>
                <DeviceText>Nome: {device.name}</DeviceText>
                <DeviceText>ID: {device.id}</DeviceText>
                <DeviceText>
                  Status: {device.connected ? 'Conectado' : 'Desconectado'}
                </DeviceText>
              </DeviceItem>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Nenhum dispositivo conhecido encontrado.</Text>
        )}
      </Scroll>

      {selectedDevice && (
        <View>
          <Text>Dispositivo selecionado:</Text>
          <Text>Nome: {selectedDevice.name}</Text>
          <Text>ID: {selectedDevice.id}</Text>
          <Text>
            Status: {selectedDevice.connected ? 'Conectado' : 'Desconectado'}
          </Text>
          {'location' in selectedDevice && selectedDevice.location ? (
            <>
              <Text>
                Última localização: {selectedDevice.location.latitude.toFixed(6)}, {selectedDevice.location.longitude.toFixed(6)}
              </Text>
              {selectedDevice.timestamp && (
                <Text>
                  Data da última localização: {selectedDevice.timestamp.toLocaleString()}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (selectedDevice.location) {
                    openMap(selectedDevice.location.latitude, selectedDevice.location.longitude);
                  }
                }}
              >
                <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Abrir no mapa</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>Nenhuma localização registrada.</Text>
          )}
        </View>
      )}
    </Container>
  );
};

export default App;
