import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [secondOperand, setSecondOperand] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  const inputDigit = (digit) => {
    if (operator && secondOperand != null) {
      // fresh start after equals
      setFirstValue(null);
      setOperator(null);
      setSecondOperand(null);
      setWaitingForSecond(false);
      setDisplay(digit);
      return;
    }
    if (waitingForSecond) {
      setDisplay(digit);
      setWaitingForSecond(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputOperator = (op) => {
    if (operator && !waitingForSecond) {
      const result = performOperation(firstValue, Number(display), operator);
      setDisplay(String(result));
      setFirstValue(result);
      setSecondOperand(null);
    } else {
      setFirstValue(Number(display));
    }
    setOperator(op);
    setWaitingForSecond(true);
  };

  const inputEquals = () => {
    if (operator && !waitingForSecond) {
      const currentSecond = Number(display);
      const result = performOperation(firstValue, currentSecond, operator);
      setDisplay(String(result));
      setFirstValue(result);
      setSecondOperand(currentSecond);
      setWaitingForSecond(false);
    } else if (operator && secondOperand != null) {
      const result = performOperation(firstValue, secondOperand, operator);
      setDisplay(String(result));
      setFirstValue(result);
    }
  };

  const performOperation = (first, second, op) => {
    if (op === '/' && second === 0) return 'Hata';
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '×': return first * second;
      case '÷': return first / second;
      default: return second;
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstValue(null);
    setOperator(null);
    setSecondOperand(null);
    setWaitingForSecond(false);
  };

  const buttonRows = [
    [
      { label: 'C', onPress: clear, style: styles.clearButton },
      { label: '÷', onPress: () => inputOperator('÷'), style: styles.operatorButton },
      { label: '×', onPress: () => inputOperator('×'), style: styles.operatorButton },
      { label: '-', onPress: () => inputOperator('-'), style: styles.operatorButton },
    ],
    [
      { label: '7', onPress: () => inputDigit('7') },
      { label: '8', onPress: () => inputDigit('8') },
      { label: '9', onPress: () => inputDigit('9') },
      { label: '+', onPress: () => inputOperator('+'), style: styles.operatorButton },
    ],
    [
      { label: '4', onPress: () => inputDigit('4') },
      { label: '5', onPress: () => inputDigit('5') },
      { label: '6', onPress: () => inputDigit('6') },
      null,
    ],
    [
      { label: '1', onPress: () => inputDigit('1') },
      { label: '2', onPress: () => inputDigit('2') },
      { label: '3', onPress: () => inputDigit('3') },
      null,
    ],
    [
      { label: '0', onPress: () => inputDigit('0') },
      null,
      null,
      { label: '=', onPress: inputEquals, style: styles.equalButton },
    ],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>
      <View style={styles.buttonGrid}>
        {buttonRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((btn, colIndex) =>
              btn ? (
                <TouchableOpacity
                  key={colIndex}
                  style={[styles.button, btn.style || styles.numberButton]}
                  onPress={btn.onPress}
                >
                  <Text style={styles.buttonText}>{btn.label}</Text>
                </TouchableOpacity>
              ) : (
                <View key={colIndex} style={styles.emptyButton} />
              )
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    justifyContent: 'flex-end',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  displayText: {
    fontSize: 80,
    color: '#ffffff',
    fontWeight: '300',
  },
  buttonGrid: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    width: 75,
    height: 75,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberButton: {
    backgroundColor: '#333333',
  },
  operatorButton: {
    backgroundColor: '#f09a36',
  },
  clearButton: {
    backgroundColor: '#a5a5a5',
  },
  equalButton: {
    backgroundColor: '#f09a36',
    width: 75 * 2 + 10, // span two columns width + margin
  },
  emptyButton: {
    width: 75,
  },
  buttonText: {
    fontSize: 30,
    color: '#ffffff',
    fontWeight: '500',
  },
});