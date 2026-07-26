import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const [suIcma, setSuIcma] = useState(0);
  const [guncelTarih, setGuncelTarih] = useState(new Date().toISOString().split('T')[0]);
  const [toplamSu, setToplamSu] = useState(0);
  const [girilenSu, setGirilenSu] = useState('');

  useEffect(() => {
    const toplamSuHesapla = () => {
      const suMiktari = parseInt(girilenSu);
      if (!isNaN(suMiktari)) {
        setToplamSu(toplamSu + suMiktari);
      }
    };
    toplamSuHesapla();
  }, [girilenSu]);

  const suGir = () => {
    setGirilenSu('');
    setSuIcma(0);
  };

  const suKaydet = () => {
    const suMiktari = parseInt(girilenSu);
    if (!isNaN(suMiktari)) {
      setSuIcma(suMiktari);
      setGirilenSu('');
    }
  };

  const suGuncelle = () => {
    const suMiktari = parseInt(girilenSu);
    if (!isNaN(suMiktari)) {
      setSuIcma(suMiktari + suIcma);
      setGirilenSu('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Günlük Su İçme Uygulaması</Text>
      <ScrollView style={styles.scroll}>
        <Text style={styles.aciklama}>Günlük su içme miktarını girin:</Text>
        <View style={styles.input}>
          <Text style={styles.suMiktari}>Su Miktari: {girilenSu}</Text>
          <TextInput
            style={styles.textInput}
            value={girilenSu}
            onChangeText={(text) => setGirilenSu(text)}
            placeholder="Su miktarını girin"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={suKaydet}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={suGuncelle}>
          <Text style={styles.buttonText}>Güncelle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={suGir}>
          <Text style={styles.buttonText}>Temizle</Text>
        </TouchableOpacity>
        <Text style={styles.sonuc}>Günlük su içme miktarı: {suIcma} ml</Text>
        <Text style={styles.sonuc}>Toplam su içme miktarı: {toplamSu} ml</Text>
        <Text style={styles.sonuc}>Güncel tarih: {guncelTarih}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  baslik: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  aciklama: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  suMiktari: {
    fontSize: 18,
    marginRight: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  sonuc: {
    fontSize: 18,
    marginBottom: 20,
  },
  scroll: {
    flex: 1,
  },
});