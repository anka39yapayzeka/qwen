import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Vibration, SafeAreaView } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerAnim = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const increment = () => {
    setCount(prev => prev + step);
    setHistory(prev => [...prev, `+${step} (Toplam: ${count + step})`]);
    triggerAnim();
    Vibration.vibrate(20);
  };

  const decrement = () => {
    setCount(prev => prev - step);
    setHistory(prev => [...prev, `-${step} (Toplam: ${count - step})`]);
    triggerAnim();
    Vibration.vibrate([0, 30, 30, 30]);
  };

  const reset = () => {
    setCount(0);
    setStep(1);
    setHistory([]);
    Vibration.vibrate(100);
  };

  const changeStep = () => {
    setStep(prev => (prev === 1 ? 5 : prev === 5 ? 10 : 1));
  };

  useEffect(() => {
    if (count === 100) {
      Vibration.vibrate([0, 50, 50, 50, 50, 50]);
    }
  }, [count]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sayaç Uygulaması</Text>

      <Animated.View style={[styles.counterBox, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.counterText}>{count}</Text>
      </Animated.View>

      <View style={styles.stepContainer}>
        <Text style={styles.stepLabel}>Adım: {step}</Text>
        <TouchableOpacity style={styles.stepButton} onPress={changeStep}>
          <Text style={styles.stepButtonText}>Değiştir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.decrementButton]} onPress={decrement}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
          <Text style={styles.resetButtonText}>Sıfırla</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.incrementButton]} onPress={increment}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Geçmiş:</Text>
        {history.length === 0 ? (
          <Text style={styles.emptyHistory}>Henüz işlem yok</Text>
        ) : (
          <View>
            {history.slice(-3).reverse().map((item, index) => (
              <Text key={index} style={styles.historyItem}>{item}</Text>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  counterBox: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#BB86FC',
  },
  counterText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#BB86FC',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  stepLabel: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  stepButton: {
    backgroundColor: '#333333',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  stepButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incrementButton: {
    backgroundColor: '#03DAC6',
  },
  decrementButton: {
    backgroundColor: '#FF0266',
  },
  resetButton: {
    backgroundColor: 'transparent',
    width: 'auto',
    height: 'auto',
    padding: 10,
  },
  buttonText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#121212',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    minHeight: 100,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  emptyHistory: {
    color: '#888888',
    fontStyle: 'italic',
  },
  historyItem: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 5,
  },
});import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Vibration } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);
  const [isNegative, setIsNegative] = useState(false);

  useEffect(() => {
    setIsNegative(count < 0);
  }, [count]);

  const handleIncrement = () => {
    const newCount = count + step;
    setCount(newCount);
    setHistory(prev => [{ id: Date.now(), value: newCount, action: `+${step}` }, ...prev].slice(0, 10));
    Vibration.vibrate(20);
  };

  const handleDecrement = () => {
    const newCount = count - step;
    setCount(newCount);
    setHistory(prev => [{ id: Date.now(), value: newCount, action: `-${step}` }, ...prev].slice(0, 10));
    Vibration.vibrate(20);
  };

  const handleReset = () => {
    setCount(0);
    setHistory(prev => [{ id: Date.now(), value: 0, action: 'Sıfırlandı' }, ...prev].slice(0, 10));
    Vibration.vibrate([10, 30, 10]);
  };

  const changeStep = (newStep) => {
    setStep(newStep);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.headerTitle}>Sayaç Uygulaması</Text>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepLabel}>Adım Seçimi: {step}</Text>
          <View style={styles.stepButtonsRow}>
            {[1, 5, 10, 25].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.stepButton, step === s && styles.activeStepButton]}
                onPress={() => changeStep(s)}
              >
                <Text style={[styles.stepButtonText, step === s && styles.activeStepButtonText]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.counterCard, isNegative && styles.negativeCard]}>
          <Text style={[styles.countText, isNegative && styles.negativeText]}>
            {count}