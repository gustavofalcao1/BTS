import { useState, useEffect } from 'react';
import { NativeModules, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocation } from './useLocation';

const { BluetoothModule } = NativeModules;

interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
}

interface BluetoothDeviceWithLocation extends BluetoothDevice {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  timestamp?: Date | null;
}

export const useBluetooth = () => {
  const [devices, setDevices] = useState<Array<BluetoothDeviceWithLocation>>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDeviceWithLocation | null>(null);

  const { location } = useLocation();

  const saveDeviceData = async (device: BluetoothDeviceWithLocation) => {
    try {
      await AsyncStorage.setItem(device.id, JSON.stringify(device));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('An unknown mistake occurred.');
      }
    }
  };

  const loadDeviceData = async (deviceId: string) => {
    try {
      const storedData = await AsyncStorage.getItem(deviceId);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('An unknown mistake occurred.');
      }
      return null;
    }
  };

  const fetchConnectedDevices = async () => {
    BluetoothModule.getConnectedDevices(async (error: string | null, devicesList: BluetoothDevice[]) => {
      if (error) {
        setErrorMsg('Error fetching connected devices');
      } else {
        const devicesWithLocation = await Promise.all(
          devicesList.map(async (device) => {
            const storedData = await loadDeviceData(device.id);
            const deviceWithLocation: BluetoothDeviceWithLocation = {
              ...device,
              location: storedData?.location || null,
              timestamp: storedData?.timestamp ? new Date(storedData.timestamp) : null,
            };
            if (device.connected && location) {
              deviceWithLocation.location = location;
              deviceWithLocation.timestamp = new Date();
              await saveDeviceData(deviceWithLocation);
            }
            return deviceWithLocation;
          })
        );

        const sortedDevices = devicesWithLocation.sort((a, b) => {
          if (a.connected !== b.connected) {
            return a.connected ? -1 : 1;
          }
          if (a.timestamp && b.timestamp) {
            return b.timestamp.getTime() - a.timestamp.getTime();
          }
          if (a.timestamp) return -1;
          if (b.timestamp) return 1;
          return 0;
        });

        setDevices(sortedDevices);
      }
    });
  };

  const handleDeviceClick = async (device: BluetoothDevice) => {
    const storedData = await loadDeviceData(device.id);
    const deviceWithLocation: BluetoothDeviceWithLocation = {
      ...device,
      location: storedData?.location || null,
      timestamp: storedData?.timestamp ? new Date(storedData.timestamp) : null,
    };
    setSelectedDevice(deviceWithLocation);
  };

  useEffect(() => {
    fetchConnectedDevices();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      devices.forEach(async (device) => {
        if (device.connected && location) {
          const deviceWithLocation: BluetoothDeviceWithLocation = {
            ...device,
            location,
            timestamp: new Date(),
          };
          await saveDeviceData(deviceWithLocation);
          setDevices((prevDevices) =>
            prevDevices.map((d) => (d.id === device.id ? deviceWithLocation : d))
          );
        }
      });
    }, 2000);
    return () => clearInterval(intervalId);
  }, [devices, location]);

  return { devices, errorMsg, selectedDevice, handleDeviceClick, fetchConnectedDevices };
};
