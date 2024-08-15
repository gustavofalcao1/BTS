import { NativeEventEmitter, NativeModules } from 'react-native';

const { BluetoothModule } = NativeModules;
const bluetoothEvents = new NativeEventEmitter(BluetoothModule);

export default bluetoothEvents;
