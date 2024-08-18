import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      ];

      const granted = await Promise.all(
        permissions.map(permission => PermissionsAndroid.check(permission))
      );

      if (!granted.every(status => status)) {
        const result = await PermissionsAndroid.requestMultiple(permissions);

        if (Object.values(result).every(status => status === PermissionsAndroid.RESULTS.GRANTED)) {
          console.log('Permissions granted');
          return true;
        } else {
          Alert.alert(
            'Necessary permissions',
            'The app needs permissions to access Bluetooth to work properly.',
            [
              { text: 'No', onPress: () => console.log('Pdenied') },
              { text: 'Yes', onPress: () => console.log('Trying again ...') },
            ]
          );
          return false;
        }
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};
