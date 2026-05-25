import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const mockData = {
  'istanbul': {
    current: { temp: 18, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png', desc: 'Bulutlu' },
    forecast: [
      { day: 'Bugün', temp: 18, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png' },
      { day: 'Yarın', temp: 20, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163662.png' },
      { day: 'Perşembe', temp: 22, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163664.png' },
      { day: 'Cuma', temp: 19, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png' },
      { day: 'Cumartesi', temp: 21, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163664.png' }
    ]
  },
  'ankara': {
    current: { temp: 15, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163662.png', desc: 'Güneşli' },
    forecast: [
      { day: 'Bugün', temp: 15, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163662.png' },
      { day: 'Yarın', temp: 17, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163664.png' },
      { day: 'Perşembe', temp: 16, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png' },
      { day: 'Cuma', temp: 14, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163662.png' },
      { day: 'Cumartesi', temp: 18, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163664.png' }
    ]
  },
  'izmir': {
    current: { temp: 22, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163664.png', desc: 'Açık' },
    forecast: [
      { day: 'Bugün', temp: 22, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163664.png' },
      { day: 'Yarın', temp: 24, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png' },
      { day: 'Perşembe', temp: 23, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163662.png' },
      { day: 'Cuma', temp: 21, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163664.png' },
      { day: 'Cumartesi', temp: 25, icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png' }
    ]
  }
};

const App = () => {
  const [selectedCity, setSelectedCity] = useState('istanbul');
  const [weatherData, setWeatherData] = useState(mockData['istanbul']);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setWeatherData(mockData[city]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HAVA DURUMU</Text>
        <Text style={styles.subtitle}>ŞEHİR SEÇİNİZ</Text>
      </View>

      <View style={styles.citySelector}>
        <TouchableOpacity
          style={[styles.cityBtn, selectedCity === 'istanbul' ? styles.activeCityBtn : null]}
          onPress={() => handleCityChange('istanbul')}
        >
          <Text style={styles.cityText}>İSTANBUL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cityBtn, selectedCity === 'ankara' ? styles.activeCityBtn : null]}
          onPress={() => handleCityChange('ankara')}
        >
          <Text style={styles.cityText}>ANKARA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cityBtn, selectedCity === 'izmir' ? styles.activeCityBtn : null]}
          onPress={() => handleCityChange('izmir')}
        >
          <Text style={styles.cityText}>İZMİR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.currentWeather}>
        <Text style={styles.cityName}>{selectedCity.toUpperCase()}</Text>
        <View style={styles.tempContainer}>
          <Image source={{ uri: weatherData.current.icon }} style={styles.icon} />
          <Text style={styles.temp}>{weatherData.current.temp}°C</Text>
        </View>
        <Text style={styles.desc}>{weatherData.current.desc}</Text>
      </View>

      <View style={styles.forecastSection}>
        <Text style={styles.forecastTitle}>5 GÜNLÜK TAHMİN</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.forecastList}>
            {weatherData.forecast.map((day, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastDay}>{day.day}</Text>
                <Image source={{ uri: day.icon }} style={styles.forecastIcon} />
                <Text style={styles.forecastTemp}>{day.temp}°C</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
    paddingHorizontal: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc'
  },
  citySelector: {
    flexDirection: 'horizontal',
    justifyContent: 'center',
    marginBottom: 40
  },
  cityBtn: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20
  },
  activeCityBtn: {
    backgroundColor: '#0a9fd8'
  },
  cityText: {
    color: '#fff',
    fontSize: 14
  },
  currentWeather: {
    alignItems: 'center',
    marginBottom: 40
  },
  cityName: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10
  },
  tempContainer: {
    flexDirection: 'horizontal',
    alignItems: 'center'
  },
  icon: {
    width: 80,
    height: 80,
    marginRight: 15
  },
  temp: {
    fontSize: 60,
    color: '#fff'
  },
  desc: {
    fontSize: 18,
    color: '#0a9fd8',
    marginTop: 10
  },
  forecastSection: {
    alignItems: 'center'
  },
  forecastTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 15
  },
  forecastList: {
    flexDirection: 'horizontal',
    paddingRight: 10
  },
  forecastItem: {
    width: 70,
    alignItems: 'center',
    marginRight: 15
  },
  forecastDay: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 5
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginBottom: 5
  },
  forecastTemp: {
    fontSize: 16,
    color: '#fff'
  }
});

export default App;