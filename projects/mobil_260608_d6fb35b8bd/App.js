import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const App = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  const handleNumber = useCallback((num) => {
    if (waitingForSecond) {
      setDisplay(String(num));
      setWaitingForSecond(false);
    } else {
      setDisplay((prev) => (prev === '0' ? String(num) : prev + String(num)));
    }
  }, [waitingForSecond]);

  const handleOperator = useCallback((op) => {
    const current = parseFloat(display);
    if (operator && !waitingForSecond) {
      const result = compute(firstOperand, current, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    } else {
      setFirstOperand(current);
    }
    setOperator(op);
    setWaitingForSecond(true);
  }, [display, firstOperand, operator, waitingForSecond]);

  const handleEqual = useCallback(() => {
    const current = parseFloat(display);
    if (operator && firstOperand !== null) {
      const