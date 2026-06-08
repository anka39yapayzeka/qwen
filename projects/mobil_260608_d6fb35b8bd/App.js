import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const App = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  const handleNumber = useCallback(
    (num) => {
      if (waitingForSecond) {
        setDisplay(String(num));
        setWaitingForSecond(false);
      } else {
        setDisplay(display === '0' ? String(num) : display + num);
      }
    },
    [display, waitingForSecond]
  );

  const performCalculation = useCallback(() => {
    const secondValue = parseFloat(display);
    switch (operator) {
      case '+':
        return firstOperand + secondValue;
      case '-':
        return firstOperand - secondValue;
      case '×':
        return firstOperand * secondValue;
      case '÷':
        return firstOperand / secondValue;
      default:
        return secondValue;
    }
  }, [firstOperand, operator, display]);

  const handleOperator = useCallback(
    (op) => {
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
    },
    [display, firstOperand, operator, performCalculation]
  );

  const handleEquals = useCallback(() => {
    if (operator === null || firstOperand === null) return;
    const result = performCalculation();
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(false);
  }, [firstOperand, operator, performCalculation]);

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
    ['0', '.', '='],
  ];

  const renderButton = (label) => {
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
    } else if (isClear) {
      buttonStyle = styles.clearButton;
      textStyle = styles.clearText;
    } else if (isBackspace) {
      buttonStyle = styles.backspaceButton;
      textStyle = styles.backspaceText;
    } else if (isDecimal) {
      buttonStyle = styles.decimalButton;
      textStyle = styles.decimalText;
    }

    const onPress = () => {
      if (isNumber) handleNumber(label);
      else if (isOperator) handleOperator(label);
      else if (isEquals) handleEquals();
      else if (isClear) handleClear();
      else if (isBackspace) handleBackspace();
      else if (isDecimal) handleDecimal();
    };

    return (
      <TouchableOpacity key={label} style={buttonStyle} onPress={onPress}>
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.buttonGrid}>
        {buttonRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(renderButton)}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    padding: 16,
  },
  displayContainer: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  displayText: {
    color: '#0f0',
    fontSize: 48,
    textAlign: 'right',
  },
  buttonGrid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 20,
    backgroundColor: '#444',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  numberButton: {
    backgroundColor: '#333',
  },
  numberText: {
    color: '#fff',
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  operatorText: {
    color: '#fff',
  },
  equalsButton: {
    backgroundColor: '#34c759',
  },
  equalsText: {
    color: '#fff',
  },
  clearButton: {
    backgroundColor: '#ff3b30',
  },
  clearText: {
    color: '#fff',
  },
  backspaceButton: {
    backgroundColor: '#8e8e93',
  },
  backspaceText: {
    color: '#fff',
  },
  decimalButton: {
    backgroundColor: '#333',
  },
  decimalText: {
    color: '#fff',
  },
});

export default App;

[Devam ediliyor…]
container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    padding: 16,
  },
  displayContainer: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  displayText: {
    color: '#0f0',
    fontSize: 48,
    textAlign: 'right',
  },
  buttonGrid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 20,
    backgroundColor: '#444',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  numberButton: {
    backgroundColor: '#333',
  },
  numberText: {
    color: '#fff',
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  operatorText: {
    color: '#fff',
  },
  equalsButton: {
    backgroundColor: '#34c759',
  },
  equalsText: {
    color: '#fff',
  },
  clearButton: {
    backgroundColor: '#ff3b30',
  },
  clearText: {
    color: '#fff',
  },
  backspaceButton: {
    backgroundColor: '#8e8e93',
  },
  backspaceText: {
    color: '#fff',
  },
  decimalButton: {
    backgroundColor: '#333',
  },
  decimalText: {
    color: '#fff',
  },
});

export default App;