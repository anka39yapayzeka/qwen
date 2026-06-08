import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const App = () => {
  const [sayi, setSayi] = React.useState(0);

  const arttir = () => {
    setSayi(sayi + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sayı: {sayi}</Text>
      <Button title="Arttır" onPress={arttir} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default App;