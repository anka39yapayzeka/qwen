import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState('Hiçbir kod okunamadı.');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      const { status: camStatus } = await BarCodeScanner.requestCameraPermissionsAsync?.() ?? { status: 'granted' };
      setHasCameraPermission(camStatus === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setResult(`Okunan Metin: ${data}`);
  };

  const askCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Kamera İzni Gerekli',
          message: 'QR kod okumak için kamera izni gereklidir.',
          buttonNeutral: 'Daha Sonra Sor',
          buttonNegative: 'İptal',
          buttonPositive: 'Tamam',
        }
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Kamera izni yükleniyor...</Text>
        <TouchableOpacity style={styles.button} onPress={askCameraPermission}>
          <Text>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Kamera erişimi reddedildi. Lütfen ayarlardan izni verin.</Text>
        <TouchableOpacity style={styles.button} onPress={askCameraPermission}>
          <Text>Tekrar Denet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Okuyucu</Text>
      </View>
      {showPlaceholder ? (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Kamera önizlemesi burada görünecek</Text>
          <TouchableOpacity style={styles.scanButton} onPress={() => setShowPlaceholder(false)}>
            <Text>Tara Başlat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <BarCodeScanner
          ref={scannerRef}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        >
          <View style={styles.overlay}>
            <View style={styles.focusBox} />
            <TouchableOpacity style={styles.captureButton} onPress={() => setScanned(false)}>
              <Text>✕ Yeniden Tara</Text>
            </TouchableOpacity>
          </View>
        </BarCodeScanner>
      )}
      <View style={styles.footer}>
        <Text style={styles.resultText}>{result}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16213e',
  },
  placeholderText: {
    color: '#a7a9be',
    fontSize: 18,
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#e94560',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  focusBox: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
  captureButton: {
    marginTop: 20,
    backgroundColor: '#16213e',
    padding: 10,
    borderRadius: 8,
  },
  footer: {
    padding: 15,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});