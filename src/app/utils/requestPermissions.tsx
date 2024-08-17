import { PermissionsAndroid, Platform } from "react-native";

export const requestBluetoothPermissions = async () => {
  if (Platform.OS === "android" && Platform.Version >= 31) {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      );

      if (!granted) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: "Permission to connect to Bluetooth",
            message: "The app needs permission to access Bluetooth.",
            buttonNeutral: "Ask me later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Permission to use Bluetooth granted");
          return true;
        } else {
          console.log("Denied Bluetooth permission");
          return false;
        }
      } else {
        console.log("Bluetooth permission already granted");
        return true;
      }
    } catch (err) {
      console.warn("Error when requesting Bluetooth permission", err);
      return false;
    }
  } else {
    console.log("Bluetooth permission is not required for this version.");
    return true;
  }
};
