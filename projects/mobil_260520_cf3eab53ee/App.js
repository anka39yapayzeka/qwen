import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        setIsScanning(true);
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData(data);
    setIsScanning(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Kamera izni isteniyor...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Kamera izni verilmedi!</Text>
        <Text>QR kodu taramak için lütfen kamera iznini etkinleştirin.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isScanning ? (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={styles.camera}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Tarama Durduruldu</Text>
          {scannedData ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Okunan Veri:</Text>
              <Text style={styles.resultData}>{scannedData}</Text>
            </View>
          ) : (
            <Text>Henüz bir QR kodu taranmadı.</Text>
          )}
          <Button title="Tekrar Tara" onPress={() => {
            setScannedData('');
            setIsScanning(true);
          }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 20,
    marginBottom: 20,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultData: {
    fontSize: 16,
    color: '#333',
  },
  permissionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  }
});