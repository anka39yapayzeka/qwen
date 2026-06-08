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
      const result = compute(firstOperand, current, operator);
      setDisplay(String(result));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecond(false);
    }
  }, [display, firstOperand, operator]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(false);
  }, []);

  const compute = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 'Hata';
      default: return b;
    }
  };

  const buttons = [
    ['Temizle', 'Bölü', 'Carpı', 'Eksi'],
    ['7', '8', '9', 'Arti'],
    ['4', '5', '6', 'Esittir'],
    ['1', '2', '3', '0']
  ];

  const handlePress = (label) => {
    if (label === 'Temizle') {
      handleClear();
    } else if (label === 'Arti' || label === 'Eksi' || label === 'Carpı' || label === 'Bölü') {
      const opMap = { 'Arti': '+', 'Eksi': '-', 'Carpı': '*', 'Bölü': '/' };
      handleOperator(opMap[label]);
    } else if (label === 'Esittir') {
      handleEqual();
    } else {
      handleNumber(parseInt(label, 10));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((label, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.button}
                onPress={() => handlePress(label)}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    justifyContent: 'flex-end',
    padding: 10,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  displayText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '300',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '500',
  },
});

export default App;

[Devam ediliyor…]
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
      const result = compute(firstOperand, current, operator);
      setDisplay(String(result));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecond(false);
    }
  }, [display, firstOperand, operator]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(false);
  }, []);

  const compute = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 'Hata';
      default: return b;
    }
  };

  const buttons = [
    ['Temizle', 'Bölü', 'Carpı', 'Eksi'],
    ['7', '8', '9', 'Arti'],
    ['4', '5', '6', 'Esittir'],
    ['1', '2', '3', '0']
  ];

  const handlePress = (label) => {
    if (label === 'Temizle') {
      handleClear();
    } else if (label === 'Arti' || label === 'Eksi' || label === 'Carpı' || label === 'Bölü') {
      const opMap = { 'Arti': '+', 'Eksi': '-', 'Carpı': '*', 'Bölü': '/' };
      handleOperator(opMap[label]);
    } else if (label === 'Esittir') {
      handleEqual();
    } else {
      handleNumber(parseInt(label, 10));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((label, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.button}
                onPress={() => handlePress(label)}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    justifyContent: 'flex-end',
    padding: 10,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  displayText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '300',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '500',
  },
});

export default App;