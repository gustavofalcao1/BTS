import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface DeviceMapProps {
  location: {
    latitude: number;
    longitude: number;
  };
  name: string;
  timestamp?: Date | null;
}

const DeviceMap: React.FC<DeviceMapProps> = ({ location, name, timestamp }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={location}
          title={name}
          description={`Last location in: ${timestamp?.toLocaleString()}`}
        />
      </MapView>
      <View style={styles.infoContainer}>
        <Text>
          Last location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
        {timestamp && (
          <Text>Date of last location: {timestamp.toLocaleString()}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 10,
  },
});

export default DeviceMap;
