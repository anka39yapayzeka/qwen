import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';

const API_KEY = 'demo_key';

const mockWeatherData = {
  istanbul: {
    city: 'İstanbul',
    temperature: 22,
    description: 'Parçalı Bulutlu',
    humidity: 65,
    windSpeed: 12,
    icon: '⛅',
  },
  ankara: {
    city: 'Ankara',
    temperature: 18,
    description: 'Açık',
    humidity: 45,
    windSpeed: 8,
    icon: '☀️',
  },
  izmir: {
    city: 'İzmir',
    temperature: 25,
    description: 'Güneşli',
    humidity: 55,
    windSpeed: 15,
    icon: '🌞',
  },
};

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError('Lütfen bir şehir adı girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const cityKey = cityName.toLowerCase().trim();
      const data = mockWeatherData[cityKey];
      
      if (data) {
        setWeather(data);
      } else {
        setError('Şehir bulunamadı. İstanbul, Ankara veya İzmir deneyin.');
        setWeather(null);
      }
    } catch (err) {
      setError('Hava durumu bilgisi alınamadı');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchWeather(city);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hava Durumu</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Şehir adı girin (İstanbul, Ankara, İzmir)"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={handleSearch}
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Aranıyor...' : 'Ara'}
        </Text>
      </TouchableOpacity>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Hava durumu bilgisi alınıyor...</Text>
        </View>
      )}

      {weather && !loading && (
        <ScrollView style={styles.weatherContainer}>
          <View style={styles.weatherCard}>
            <Text style={styles.cityName}>{weather.city}</Text>
            <Text style={styles.icon}>{weather.icon}</Text>
            <Text style={styles.temperature}>{weather.temperature}°C</Text>
            <Text style={styles.description}>{weather.description}</Text>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Nem</Text>
                <Text style={styles.detailValue}>{weather.humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Rüzgar Hızı</Text>
                <Text style={styles.detailValue}>{weather.windSpeed} km/s</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Demo uygulaması - Gerçek API entegrasyonu için API anahtarı gerekli
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1565C0',
  },
  searchContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#BBDEFB',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  weatherContainer: {
    flex: 1,
  },
  weatherCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
  },
  icon: {
    fontSize: 80,
    marginVertical: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    color: '#666',
    marginBottom: 30,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});