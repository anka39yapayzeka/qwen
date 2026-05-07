import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sayaç Uygulaması</Text>
        <Text style={styles.count}>{count}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.decrementBtn]} onPress={decrement}>
            <Text style={styles.buttonText}>Azalt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.resetBtn]} onPress={reset}>
            <Text style={styles.buttonText}>Sıfırla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.incrementBtn]} onPress={increment}>
            <Text style={styles.buttonText}>Artır</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  count: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  incrementBtn: {
    backgroundColor: '#4CAF50',
  },
  decrementBtn: {
    backgroundColor: '#F44336',
  },
  resetBtn: {
    backgroundColor: '#FF9800',
  },
});