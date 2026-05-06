import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
const STORAGE_KEY = '@notes_app';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    saveNotes();
  }, [notes]);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setNotes(JSON.parse(stored));
    } catch (e) {
      Alert.alert('Hata', 'Notlar yüklenemedi');
    }
  };

  const saveNotes = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      Alert.alert('Hata', 'Notlar kaydedilemedi');
    }
  };

  const addOrUpdateNote = () => {
    if (!inputText.trim()) return;
    if (editingId) {
      setNotes(prev =>
        prev.map(note =>
          note.id === editingId ? { ...note, text: inputText, color: selectedColor } : note
        )
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now().toString(),
        text: inputText,
        color: selectedColor,
        createdAt: new Date().toISOString(),
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setInputText('');
    setSelectedColor(COLORS[0]);
    Keyboard.dismiss();
  };

  const deleteNote = (id) => {
    Alert.alert('Notu Sil', 'Bu notu silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', onPress: () => setNotes(prev => prev.filter(note => note.id !== id)), style: 'destructive' },
    ]);
  };

  const startEditing = (note) => {
    setInputText(note.text);
    setSelectedColor(note.color);
    setEditingId(note.id);
    inputRef.current?.focus();
  };

  const cancelEditing = () => {
    setInputText('');
    setSelectedColor(COLORS[0]);
    setEditingId(null);
    Keyboard.dismiss();
  };

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    return notes.filter(note =>
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  const renderNote = ({ item }) => (
    <View style={[styles.noteCard, { backgroundColor: item.color }]}>
      <Text style={styles.noteText}>{item.text}</Text>
      <Text style={styles.noteDate}>
        {new Date(item.createdAt).toLocaleDateString('tr-TR')}
      </Text>
      <View style={styles.noteActions}>
        <TouchableOpacity onPress={() => startEditing(item)} style={styles.actionButton}>
          <Text style={styles.actionText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.actionButton}>
          <Text style={[styles.actionText, { color: '#d32f2f' }]}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Notlarım</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Not ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder="Yeni not..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <View style={styles.colorRow}>
            {COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
          <View style={styles.buttonRow}>
            {editingId && (
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEditing}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: selectedColor }]}
              onPress={addOrUpdateNote}
            >
              <Text style={styles.addButtonText}>
                {editingId ? 'Güncelle' : 'Ekle'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={filteredNotes}
          renderItem={renderNote}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Henüz not yok</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flex: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  textInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
    borderWidth: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  noteCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 16,
    padding: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});