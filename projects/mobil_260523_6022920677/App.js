import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const cityData = {
  'İstanbul': {
    current: { temp: 18, desc: 'Parçalı Bulutlu', icon: '⛅' },
    forecast: [
      { day: 'Salı', temp: 19, icon: '☀️' },
      { day: 'Çarşamba', temp: 17, icon: '☁️' },
      { day: 'Perşembe', temp: 16, icon: '🌧️' },
      { day: 'Cuma', temp: 20, icon: '⛅' },
      { day: 'Cumartesi', temp: 22, icon: '☀️' }
    ]
  },
  'Ankara': {
    current: { temp: 15, desc: 'Az Bulutlu', icon: '🌤️' },
    forecast: [
      { day: 'Salı', temp: 14, icon: '☁️' },
      { day: 'Çarşamba', temp: 13, icon: '🌧️' },
      { day: 'Perşembe', temp: 12, icon: '🌧️' },
      { day: 'Cuma', temp: 16, icon: '⛅' },
      { day: 'Cumartesi', temp: 18, icon: '☀️' }
    ]
  },
  'İzmir': {
    current: { temp: 22, desc: 'Açık', icon: '☀️' },
    forecast: [
      { day: 'Salı', temp: 23, icon: '☀️' },
      { day: 'Çarşamba', temp: 21, icon: '⛅' },
      { day: 'Perşembe', temp: 20, icon: '☁️' },
      { day: 'Cuma', temp: 24, icon: '☀️' },
      { day: 'Cumartesi', temp: 25, icon: '☀️' }
    ]
  },
  'Antalya': {
    current: { temp: 24, desc: 'Güneşli', icon: '☀️' },
    forecast: [
      { day: 'Salı', temp: 25, icon: '☀️' },
      { day: 'Çarşamba', temp: 23, icon: '⛅' },
      { day: 'Perşembe', temp: 22, icon: '☁️' },
      { day: 'Cuma', temp: 26, icon: '☀️' },
      { day: 'Cumartesi', temp: 27, icon: '☀️' }
    ]
  },
  'Bursa': {
    current: { temp: 16, desc: 'Yağmurlu', icon: '🌧️' },
    forecast: [
      { day: 'Salı', temp: 15, icon: '🌧️' },
      { day: 'Çarşamba', temp: 14, icon: '🌧️' },
      { day: 'Perşembe', temp: 13, icon: '🌧️' },
      { day: 'Cuma', temp: 17, icon: '⛅' },
      { day: 'Cumartesi', temp: 19, icon: '☀️' }
    ]
  }
};

const cities = Object.keys(cityData);

export default function App() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const city = cityData[selectedCity];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Hava Durumu</Text>
      <View style={styles.citySelector}>
        {cities.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.cityButton, selectedCity === c && styles.cityButtonActive]}
            onPress={() => setSelectedCity(c)}
          >
            <Text style={[styles.cityButtonText, selectedCity === c && styles.cityButtonTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.currentContainer}>
        <Text style={styles.cityName}>{selectedCity}</Text>
        <Text style={styles.currentTemp}>{city.current.temp}°C</Text>
        <Text style={styles.currentIcon}>{city.current.icon}</Text>
        <Text style={styles.currentDesc}>{city.current.desc}</Text>
      </View>
      <Text style={styles.forecastTitle}>5 Günlük Tahmin</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastContainer}>
        {city.forecast.map((day, index) => (
          <View key={index} style={styles.forecastDay}>
            <Text style={styles.forecastDayText}>{day.day}</Text>
            <Text style={styles.forecastIcon}>{day.icon}</Text>
            <Text style={styles.forecastTemp}>{day.temp}°C</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  citySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  cityButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#16213e',
    margin: 5,
  },
  cityButtonActive: {
    backgroundColor: '#e94560',
  },
  cityButtonText: {
    color: '#a7a9be',
    fontSize: 16,
  },
  cityButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  currentContainer: {
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  cityName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },
  currentTemp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
  },
  currentIcon: {
    fontSize: 50,
    marginVertical: 5,
  },
  currentDesc: {
    fontSize: 18,
    color: '#a7a9be',
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    marginLeft: 5,
  },
  forecastContainer: {
    flexDirection: 'row',
  },
  forecastDay: {
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    minWidth: 80,
  },
  forecastDayText: {
    fontSize: 16,
    color: '#a7a9be',
    marginBottom: 8,
  },
  forecastIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});