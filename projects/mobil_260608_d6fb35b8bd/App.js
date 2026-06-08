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
      setDisplay(display === '0' ? String(num) : display + num);
    }
  }, [display, waitingForSecond]);

  const handleOperator = useCallback((op) => {
    const inputValue = parseFloat(display);
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setFirstOperand(result);
      setDisplay(String(result));
    }
    setOperator(op);
    setWaitingForSecond(true);
  }, [display, firstOperand, operator]);

  const performCalculation = () => {
    const secondValue = parseFloat(display);
    switch (operator) {
      case '+': return firstOperand + secondValue;
      case '-': return firstOperand - secondValue;
      case '×': return firstOperand * secondValue;
      case '÷': return firstOperand / secondValue;
      default: return secondValue;
    }
  };

  const handleEquals = useCallback(() => {
    if (operator === null || firstOperand === null) return;
    const result = performCalculation();
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(false);
  }, [firstOperand, operator]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(false);
  }, []);

  const handleDecimal = useCallback(() => {
    if (waitingForSecond) {
      setDisplay('0.');
      setWaitingForSecond(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForSecond]);

  const handleBackspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  const buttonRows = [
    ['C', '⌫', '÷', '×'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', '=']
  ];

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.buttonGrid}>
        {buttonRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((label) => {
              const isNumber = /^[0-9]$/.test(label);
              const isEquals = label === '=';
              const isOperator = ['+', '-', '×', '÷'].includes(label);
              const isClear = label === 'C';
              const isBackspace = label === '⌫';
              const isDecimal = label === '.';
              let buttonStyle = styles.button;
              let textStyle = styles.buttonText;
              if (isNumber) {
                buttonStyle = styles.numberButton;
                textStyle = styles.numberText;
              } else if (isEquals) {
                buttonStyle = styles.equalsButton;
                textStyle = styles.equalsText;
              } else if (isOperator) {
                buttonStyle = styles.operatorButton;
                textStyle = styles.operatorText;
              } else if (isClear || isBackspace) {