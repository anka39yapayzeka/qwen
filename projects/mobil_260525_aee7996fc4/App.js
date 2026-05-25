import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';

const mockWeatherData = [
  { city: 'Istanbul', date: '2023-10-20', temp: 18, condition: 'cloudy' },
  { city: 'Istanbul', date: '2023-10-21', temp: 19, condition: 'sunny' },
  { city: 'Istanbul', date: '2023-10-22', temp: 17, condition: 'rainy' },
  { city: 'Istanbul', date: '2023-10-23', temp: 16, condition: 'cloudy' },
  { city: 'Istanbul', date: '2023-10-24', temp: 18, condition: 'sunny' },
  { city: 'Ankara', date: '2023-10-20', temp: 16, condition: 'rainy' },
  { city: 'Ankara', date: '2023-10-21', temp: 15, condition: 'snowy' },
  { city: 'Ankara', date: '2023-10-22', temp: 14, condition: 'cloudy' },
  { city: 'Ankara', date: '2023-10-23', temp: 15, condition: 'sunny' },
  { city: 'Ankara', date: '2023-10-24', temp: 16, condition: 'cloudy' },
  { city: 'Izmir', date: '2023-10-20', temp: 20, condition: 'sunny' },
  { city: 'Izmir', date: '2023-10-21', temp: 21, condition: 'sunny' },
  { city: 'Izmir', date: '2023-10-22', temp: 19, condition: 'cloudy' },
  { city: 'Izmir', date: '2023-10-23', temp: 20, condition: 'rainy' },
  { city: 'Izmir', date: '2023-10-24', temp: 22, condition: 'sunny' },
];

const getWeatherIcon = (condition) => {
  switch (condition) {
    case 'sunny': return '☀️';
    case 'cloudy': return '☁️';
    case 'rainy': return '🌧️';
    case 'snowy': return '❄️';
    default: return '❓';
  }
};

const App = () => {
  const [city, setCity] = useState('');
  const [weatherList, setWeatherList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (!city.trim()) {
      setWeatherList([]);
      setSelectedCity(null);
      return;
    }
    const filtered = mockWeatherData.filter(item =>
      item.city.toLowerCase() === city.toLowerCase()
    );
    setWeatherList(filtered);
    if (filtered.length > 0) {
      setSelectedCity(filtered[0].city);
    } else {
      setSelectedCity(null);
    }
  }, [city]);

  const renderWeatherItem = ({ item }) => (
    <View style={styles.weatherItem}>
      <View style={styles.leftColumn}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.temp}>{item.temp}°C</Text>
      </View>
      <Text style={styles.icon}>{getWeatherIcon(item.condition)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hava Durumu</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Şehir adı girin (örn: Istanbul)"
          onChangeText={setCity}
          value={city}
          placeholderTextColor="#888"
          autoCapitalize="none"
        />
        {selectedCity && (
          <Text style={styles.selectedCity}>{selectedCity.toUpperCase()}</Text>
        )}
      </View>
      <FlatList
        data={weatherList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderWeatherItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {city.trim() ? 'Şehir bulunamadı' : 'Şehir giriniz'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  selectedCity: {
    color: '#ffffff',
    marginTop: 5,
    fontSize: 14,
    opacity: 0.8,
  },
  weatherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  leftColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  date: {
    color: '#ffffff',
    fontSize: 16,
  },
  temp: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 32,
    color: '#ffffff',
  },
  emptyText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
});

export default App;