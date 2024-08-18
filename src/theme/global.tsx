import React from 'react';
import { StyleSheet, View, ScrollView, Text as RNText, TouchableOpacity } from 'react-native';

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.container}>
    {children}
  </View>
);

export const Scroll: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ScrollView style={styles.scroll}>
    {children}
  </ScrollView>
);

export const Title: React.FC<{ children: React.ReactNode, style?: any }> = ({ children, style }) => (
  <RNText style={[styles.title, style]}>
    {children}
  </RNText>
);

export const Text: React.FC<{ children: React.ReactNode, style?: any }> = ({ children, style }) => (
  <RNText style={[styles.text, style]}>
    {children}
  </RNText>
);

export const DeviceItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.deviceItem}>
    {children}
  </View>
);

export const DeviceText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RNText style={styles.deviceText}>
    {children}
  </RNText>
);

export const ErrorText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RNText style={styles.errorText}>
    {children}
  </RNText>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
    paddingTop: '10%'
  },
  scroll: {
    width: '95%',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  deviceItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceText: {
    fontSize: 16,
    color: '#444',
  },
  errorText: {
    fontSize: 16,
    color: '#f00',
    textAlign: 'center',
    marginTop: 16,
  }
});
