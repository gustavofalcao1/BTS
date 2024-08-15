package com.gustavofalcao1.BTS

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

class BluetoothModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BluetoothModule"
    }

    @ReactMethod
    fun getConnectedDevices(callback: Callback) {
        val bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
        if (bluetoothAdapter == null) {
            callback.invoke("Bluetooth not supported")
            return
        }

        val pairedDevices = bluetoothAdapter.bondedDevices
        val connectedDevices: WritableArray = Arguments.createArray()

        for (device in pairedDevices) {
            val connected = isConnected(device)
            val deviceInfo: WritableMap = Arguments.createMap()
            deviceInfo.putString("id", device.address)
            deviceInfo.putString("name", device.name)
            deviceInfo.putBoolean("connected", connected)
            connectedDevices.pushMap(deviceInfo)
        }

        callback.invoke(null, connectedDevices)
    }

    private fun isConnected(device: BluetoothDevice): Boolean {
        try {
            val method = device.javaClass.getMethod("isConnected")
            return method.invoke(device) as Boolean
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return false
    }

    @ReactMethod
    fun addListener(eventName: String) {
    }

    @ReactMethod
    fun removeListeners(count: Int) {
    }
}
