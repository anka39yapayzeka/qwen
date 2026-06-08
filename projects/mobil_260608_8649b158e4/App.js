import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  RefreshControl,
  Modal,
  FlatList,
  ImageBackground,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const API_KEY = 'demo_key';

const mockWeatherData = {
  istanbul: {
    city: 'İstanbul',
    temperature: 22,
    description: 'Parçalı Bulutlu',
    humidity: 65,
    windSpeed: 12,
    icon: '⛅',
    feelsLike: 24,
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    sunrise: '06:45',
    sunset: '19:30',
    forecast: [
      { day: 'Pzt', icon: '⛅', high: 24, low: 18 },
      { day: 'Sal', icon: '🌧️', high: 20, low: 16 },
      { day: 'Çar', icon: '☀️', high: 26, low: 19 },
      { day: 'Per', icon: '⛅', high: 23, low: 17 },
      { day: 'Cum', icon: '🌤️', high: 25, low: 18 },
    ],
    hourly: [
      { time: '09:00', temp: 20, icon: '⛅' },
      { time: '12:00', temp: 22, icon: '⛅' },
      { time: '15:00', temp: 24, icon: '☀️' },
      { time: '18:00', temp: 21, icon: '🌤️' },
      { time: '21:00', temp: 19, icon: '🌙' },
    ],
  },
  ankara: {
    city: 'Ankara',
    temperature: 18,
    description: 'Açık',
    humidity: 45,
    windSpeed: 8,
    icon: '☀️',
    feelsLike: 17,
    pressure: 1018,
    visibility: 15,
    uvIndex: 7,
    sunrise: '06:30',
    sunset: '19:15',
    forecast: [
      { day: 'Pzt', icon: '☀️', high: 20, low: 12 },
      { day: 'Sal', icon: '☀️', high: 22, low: 14 },
      { day: 'Çar', icon: '⛅', high: 19, low: 13 },
      { day: 'Per', icon: '🌧️', high: 16, low: 11 },
      { day: 'Cum', icon: '⛅', high: 18, low: 12 },
    ],
    hourly: [
      { time: '09:00', temp: 15, icon: '☀️' },
      { time: '12:00', temp: 18, icon: '☀️' },
      { time: '15:00', temp: 20, icon: '☀️' },
      { time: '18:00', temp: 17, icon: '🌤️' },
      { time: '21:00', temp: 14, icon: '🌙' },
    ],
  },
  izmir: {
    city: 'İzmir',
    temperature: 25,
    description: 'Güneşli',
    humidity: 55,
    windSpeed: 15,
    icon: '🌞',
    feelsLike: 27,
    pressure: 1010,
    visibility: 12,
    uvIndex: 8,
    sunrise: '06:50',
    sunset: '19:40',
    forecast: [
      { day: 'Pzt', icon: '🌞', high: 27, low: 20 },
      { day: 'Sal', icon: '☀️', high: 28, low: 21 },
      { day: 'Çar', icon: '⛅', high: 25, low: 19 },
      { day: 'Per', icon: '☀️', high: 26, low: 20 },
      { day: 'Cum', icon: '🌞', high: 29, low: 22 },
    ],
    hourly: [
      { time: '09:00', temp: 22, icon: '☀️' },
      { time: '12:00', temp: 25, icon: '🌞' },
      { time: '15:00', temp: 27, icon: '🌞' },
      { time: '18:00', temp: 24, icon: '🌤️' },
      { time: '21:00', temp: 21, icon: '🌙' },
    ],
  },
  antalya: {
    city: 'Antalya',
    temperature: 28,
    description: 'Güneşli',
    humidity: 60,
    windSpeed: 10,
    icon: '🌞',
    feelsLike: 30,
    pressure: 1008,
    visibility: 14,
    uvIndex: 9,
    sunrise: '06:40',
    sunset: '19:35',
    forecast: [
      { day: 'Pzt', icon: '🌞', high: 30, low: 23 },
      { day: 'Sal', icon: '🌞', high: 31, low: 24 },
      { day: 'Çar', icon: '☀️', high: 29, low: 22 },
      { day: 'Per', icon: '⛅', high: 27, low: 21 },
      { day: 'Cum', icon: '🌞', high: 30, low: 23 },
    ],
    hourly: [
      { time: '09:00', temp: 25, icon: '☀️' },
      { time: '12:00', temp: 28, icon: '🌞' },
      { time: '15:00', temp: 30, icon: '🌞' },
      { time: '18:00', temp: 27, icon: '🌤️' },
      { time: '21:00', temp: 24, icon: '🌙' },
    ],
  },
  bursa: {
    city: 'Bursa',
    temperature: 20,
    description: 'Bulutlu',
    humidity: 70,
    windSpeed: 6,
    icon: '☁️',
    feelsLike: 19,
    pressure: 1015,
    visibility: 8,
    uvIndex: 4,
    sunrise: '06:35',
    sunset: '19:20',
    forecast: [
      { day: 'Pzt', icon: '☁️', high: 22, low: 15 },
      { day: 'Sal', icon: '🌧️', high: 18, low: 14 },
      { day: 'Çar', icon: '⛅', high: 21, low: 16 },
      { day: 'Per', icon: '☀️', high: 24, low: 17 },
      { day: 'Cum', icon: '⛅', high: 22, low: 15 },
    ],
    hourly: [
      { time: '09:00', temp: 17, icon: '☁️' },
      { time: '12:00', temp: 20, icon: '⛅' },
      { time: '15:00', temp: 22, icon: '⛅' },
      { time: '18:00', temp: 19, icon: '🌤️' },
      { time: '21:00', temp: 16, icon: '🌙' },
    ],
  },
};

const popularCities = [
  { name: 'İstanbul', key: 'istanbul' },
  { name: 'Ankara', key: 'ankara' },
  { name: 'İzmir', key: 'izmir' },
  { name: 'Antalya', key: 'antalya' },
  { name: 'Bursa', key: 'bursa' },
];

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showForecast, setShowForecast] = useState(false);
  const [unit, setUnit] = useState('C');
  const [showCityModal, setShowCityModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (weather) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [weather]);

  const convertTemp = useCallback((temp) => {
    if (unit === 'F') {
      return Math.round((temp * 9) / 5 + 32);
    }
    return temp;
  }, [unit]);

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError('Lütfen bir şehir adı girin');
      return;
    }

    setLoading(true);
    setError('');
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.9);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const cityKey = cityName.toLowerCase().trim();
      const data = mockWeatherData[cityKey];

      if (data) {
        setWeather(data);
        setRecentSearches((prev) => {
          const filtered = prev.filter((item) => item !== data.city);
          return [data.city, ...filtered].slice(0, 5);
        });
      } else {
        setError('Şehir bulunamadı. İstanbul, Ankara, İzmir, Antalya veya Bursa deneyin.');
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

  const handleRefresh = async () => {
    if (weather) {
      setRefreshing(true);
      await fetchWeather(weather.city);
      setRefreshing(false);
    }
  };

  const handleCitySelect = (cityKey, cityName) => {
    setCity(cityName);
    setShowCityModal(false);
    fetchWeather(cityName);
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const getBackgroundGradient = () => {
    if (!weather) return ['#E3F2FD', '#BBDEFB'];
    const temp = weather.temperature;
    if (temp >= 25) return ['#FFF3E0', '#FFE0B2'];
    if (temp >= 15) return ['#E3F2FD', '#BBDEFB'];
    return ['#E8EAF6', '#C5CAE9'];
  };

  const renderHourlyItem = ({ item }) => (
    <View style={styles.hourlyItem}>
      <Text style={styles.hourlyTime}>{item.time}</Text>
      <Text style={styles.hourlyIcon}>{item.icon}</Text>
      <Text style={styles.hourlyTemp}>{convertTemp(item.temp)}°</Text>
    </View>
  );

  const renderForecastItem = ({ item }) => (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastDay}>{item.day}</Text>
      <Text style={styles.forecastIcon}>{item.icon}</Text>
      <View style={styles.forecastTemps}>
        <Text style={styles.forecastHigh}>{convertTemp(item.high)}°</Text>
        <Text style={styles.forecastLow}>{convertTemp(item.low)}°</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E3F2FD" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#4A90E2']} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>🌤️ Hava Durumu</Text>
          <TouchableOpacity style={styles.unitButton} onPress={toggleUnit}>
            <Text style={styles.unitButtonText}>°{unit}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Şehir adı girin..."
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.citySelectorButton} onPress={() => setShowCityModal(true)}>
          <Text style={styles.citySelectorText}>📍 Popüler Şehirler</Text>
        </TouchableOpacity>

        {recentSearches.length > 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.recentTitle}>Son Aramalar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => {
                    setCity(item);
                    fetchWeather(item);
                  }}
                >
                  <Text style={styles.recentItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {error ? (
          <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        ) : null}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Hava durumu bilgisi alınıyor...</Text>
          </View>
        )}

        {weather && !loading && (
          <Animated.View
            style={[
              styles.weatherContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.mainWeatherCard}>
              <View style={styles.cityHeader}>
                <Text style={styles.cityName}>{weather.city}</Text>
                <Text style={styles.currentDate}>
                  {new Date().toLocaleDateString('tr-TR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </Text>
              </View>

              <View style={styles.mainWeatherInfo}>
                <Text style={styles.icon}>{weather.icon}</Text>
                <Text style={styles.temperature}>{convertTemp(weather.temperature)}°{unit}</Text>
                <Text style={styles.description}>{weather.description}</Text>
                <Text style={styles.feelsLike}>
                  Hissedilen: {convertTemp(weather.feelsLike)}°{unit}
                </Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>💧</Text>
                <Text style={styles.detailLabel}>Nem</Text>
                <Text style={styles.detailValue}>{weather.humidity}%</Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>💨</Text>
                <Text style={styles.detailLabel}>Rüzgar</Text>
                <Text style={styles.detailValue}>{weather.windSpeed} km/s</Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>🌡️</Text>
                <Text style={styles.detailLabel}>Basınç</Text>
                <Text style={styles.detailValue}>{weather.pressure} hPa</Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>👁️</Text>
                <Text style={styles.detailLabel}>Görüş</Text>
                <Text style={styles.detailValue}>{weather.visibility} km</Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>☀️</Text>
                <Text style={styles.detailLabel}>UV İndeks</Text>
                <Text style={styles.detailValue}>{weather.uvIndex}</Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>🌅</Text>
                <Text style={styles.detailLabel}>Gündoğumu</Text>
                <Text style={styles.detailValue}>{weather.sunrise}</Text>
              </View>
            </View>

            <View style={styles.sunTimesContainer}>
              <View style={styles.sunTimeItem}>
                <Text style={styles.sunIcon}>🌅</Text>
                <Text style={styles.sunLabel}>Gündoğumu</Text>
                <Text style={styles.sunValue}>{weather.sunrise}</Text>
              </View>
              <View style={styles.sunTimeItem}>
                <Text style={styles.sunIcon}>🌇</Text>
                <Text style={styles.sunLabel}>Günbatımı</Text>
                <Text style={styles.sunValue}>{weather.sunset}</Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>⏰ Saatlik Tahmin</Text>
              <FlatList
                data={weather.hourly}
                renderItem={renderHourlyItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hourlyList}
              />
            </View>

            <TouchableOpacity
              style={styles.forecastToggle}
              onPress={() => setShowForecast(!showForecast)}
            >
              <Text style={styles.forecastToggleText}>
                {showForecast ? '📅 5 Günlük Tahmin (Gizle)' : '📅 5 Günlük Tahmin (Göster)'}
              </Text>
            </TouchableOpacity>

            {showForecast && (
              <View style={styles.forecastContainer}>
                <FlatList
                  data={weather.forecast}
                  renderItem={renderForecastItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            )}
          </Animated.View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Demo uygulaması - Gerçek API entegrasyonu için API anahtarı gerekli
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showCityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Şehir Seçin</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            {popularCities.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.modalCityItem}
                onPress={() => handleCitySelect(item.key, item.name)}
              >
                <Text style={styles.modalCityName}>{item.name}</Text>
                <Text style={styles.mockDataIndicator}>
                  {mockWeatherData[item.key] ? '✅' : '❌'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  unitButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: '#BBDEFB',
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  citySelectorButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  citySelectorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  recentContainer: {
    marginBottom: 15,
  },
  recentTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recentItem: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  recentItemText: {
    fontSize: 14,
    color: '#4A90E2',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  loadingText: {
    marginTop: 15,
    color: '#666',
    fontSize: 14,
  },
  weatherContainer: {
    marginBottom: 20,
  },
  mainWeatherCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cityHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  currentDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  mainWeatherInfo: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginVertical: 10,
  },
  temperature: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  description: {
    fontSize: 20,
    color: '#666',
    marginTop: 5,
  },
  feelsLike: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    width: (width - 60) / 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginTop: 3,
  },
  sunTimesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sunTimeItem: {
    alignItems: 'center',
  },
  sunIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  sunLabel: {
    fontSize: 12,
    color: '#666',
  },
  sunValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginTop: 3,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
  },
  hourlyList: {
    paddingRight: 20,
  },
  hourlyItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    width: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  hourlyTime: {
    fontSize: 12,
    color: '#666',
  },
  hourlyIcon: {
    fontSize: 24,
    marginVertical: 5,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  forecastToggle: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  forecastToggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  forecastContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 40,
  },
  forecastIcon: {
    fontSize: 28,
    flex: 1,
    textAlign: 'center',
  },
  forecastTemps: {
    flexDirection: 'row',
    gap: 10,
    width: 80,
    justifyContent: 'flex-end',
  },
  forecastHigh: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  forecastLow: {
    fontSize: 16,
    color: '#999',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  modalCityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalCityName: {
    fontSize: 18,
    color: '#333',
  },
  mockDataIndicator: {
    fontSize: 16,
  },
});
```