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

      <Animated.View style={[styles.counterBox, {