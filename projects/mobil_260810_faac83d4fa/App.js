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
    Vibration.vibrate([0, 30, 30