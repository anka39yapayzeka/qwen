import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    saveNotes();
  }, [notes]);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem('notes');
      if (stored !== null) {
        setNotes(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Notlar yüklenirken hata:', e);
    }
  };

  const saveNotes = async () => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (e) {
      console.error('Notlar kaydedilirken hata:', e);
    }
  };

  const addNote = () => {
    if (text.trim().length === 0) return;

    const newNote = {
      id: Date.now().toString(),
      text: text.trim(),
      date: new Date().toLocaleString('tr-TR'),
    };

    setNotes([newNote, ...notes]);
    setText('');
    Keyboard.dismiss();
  };

  const deleteNote = (id) => {
    Alert.alert(
      'Notu Sil',
      'Bu notu silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            setNotes((prev) => prev.filter((note) => note.id !== id));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteContent}>
        <Text style={styles.noteText}>{item.text}</Text>
        <Text style={styles.noteDate}>{item.date}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNote(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Not Defterim</Text>
        <Text style={styles.headerSubtitle}>{notes.length} not</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni not yazın..."
          placeholderTextColor="#95a5a6"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
          onPress={addNote}
          disabled={!text.trim()}
        >
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz not eklenmedi.</Text>
            <Text style={styles.emptySubtext}>Yukarıdan ilk notunuzu oluşturabilirsiniz.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    color: '#2c3e50',
    minHeight: 60,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  noteContent: {
    flex: 1,
  },
  noteText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
  },
  noteDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 8,
  },
  deleteButton: {
    marginLeft: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 6,
  },
});