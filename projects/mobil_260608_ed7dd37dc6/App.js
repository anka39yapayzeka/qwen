import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const choices = ['Taş', 'Kağıt', 'Makas'];

const getComputerChoice = () => choices[Math.floor(Math.random() * 3)];

const getResult = (user, computer) => {
  if (user === computer) return 'Berabere';
  if (
    (user === 'Taş' && computer === 'Makas') ||
    (user === 'Kağıt' && computer === 'Taş') ||
    (user === 'Makas' && computer === 'Kağıt')
  ) return 'Kazandın!';
  return 'Kaybettin!';
};

export default function App() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const handleChoice = (choice) => {
    const comp = getComputerChoice();
    const res = getResult(choice, comp);
    setUserChoice(choice);
    setComputerChoice(comp);
    setResult(res);
    if (res === 'Kazandın!') setUserScore((prev) => prev + 1);
    else if (res === 'Kaybettin!') setComputerScore((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Taş Kağıt Makas</Text>

      <View style={styles.scoreBoard}>
        <Text style={styles.score}>Sen: {userScore}</Text>
        <Text style={styles.score}>Bilgisayar: {computerScore}</Text>
      </View>

      {userChoice && (
        <View style={styles.choiceDisplay}>
          <Text style={styles.choiceText}>Sen: {userChoice}</Text>
          <Text style={styles.choiceText}>Bilgisayar: {computerChoice}</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}

      <View style={styles.buttons}>
        {choices.map((choice) => (
          <TouchableOpacity key={choice} style={styles.button} onPress={() => handleChoice(choice)}>
            <Text style={styles.buttonText}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  choiceDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  choiceText: {
    fontSize: 18,
    marginVertical: 5,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});