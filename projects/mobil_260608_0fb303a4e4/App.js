import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';

const CounterDisplay = ({ count }) => (
  <View style={styles.displayContainer}>
    <Text style={styles.label}>Güncel Sayı</Text>
    <Text style={[
      styles.countText, 
      { color: count < 0 ? '#ff4d4d' : count > 0 ? '#4CAF50' : '#333' }
    ]}>
      {count}
    </Text>
  </View>
);

const ControlButton = ({ title, onPress, color, symbol }) => (
  <TouchableOpacity 
    style={[styles.button, { backgroundColor: color }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.buttonText}>{symbol || title}</Text>
  </TouchableOpacity>
);

export default function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Sayaç Uygulaması</Text>
        
        <CounterDisplay count={count} />

        <View style={styles.buttonRow}>
          <ControlButton 
            symbol="-" 
            color="#f44336" 
            onPress={decrement} 
          />
          <ControlButton 
            symbol="+" 
            color="#4CAF50" 
            onPress={increment} 
          />
        </View>

        <ControlButton 
          title="Sıfırla" 
          color="#2196F3" 
          onPress={reset} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#2c3e50',
  },
  displayContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  label: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  countText: {
    fontSize: 80,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
});