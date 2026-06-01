import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval;
    if (count > 0) {
      interval = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [count]);

  const start = () => setCount(10);
  const stop = () => setCount(0);
  const reset = () => setCount(0);
  const tick = () => setCount((prev) => prev + 1);

  return (
    <View style={styles.container}>
      <Text style={styles.number}>{count}</Text>
      <View style={styles.row}>
        <Button title="Başlat" onPress={start} />
        <Button title="Dur" onPress={stop} />
        <Button title="Sıfırla" onPress={reset} />
      </View>
      <View style={styles.row}>
        <Button title="+" onPress={tick} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginTop: 20,
  },
});