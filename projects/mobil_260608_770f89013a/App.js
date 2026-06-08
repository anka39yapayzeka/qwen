import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const App = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  const decrement = () => {
    setCount(prevCount => prevCount - 1);
  };

  useEffect(() => {
    console.log(`Count: ${count}`);
  }, [count]);

  return (
    <View style={styles.container}>
      <Text style={styles.countText}>{count}</Text>
      <Button title="Increase" onPress={increment} />
      <Button title="Decrease" onPress={decrement} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 48,
    marginBottom: 20,
  },
});

export default App;