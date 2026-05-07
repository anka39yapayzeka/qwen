import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  Modal,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      saveNotes(notes);
    }
  }, [notes]);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('@my_notes');
      if (savedNotes !== null) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      Alert.alert('Hata', 'Notlar yüklenirken bir sorun oluştu.');
    }
  };

  const saveNotes = async (newNotes) => {
    try {
      await AsyncStorage.setItem('@my_notes', JSON.stringify(newNotes));
    } catch (error) {
      Alert.alert('Hata', 'Notlar kaydedilemedi.');
    }
  };

  const handleAddNote = () => {
    const trimmedText = inputText.trim();
    if (trimmedText === '') {
      Alert.alert('Uyarı', 'Lütfen bir not giriniz.');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      text: trimmedText,
      date: new Date().toLocaleString(),
      completed: false,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setInputText('');
    Keyboard.dismiss();
  };

  const handleDeleteNote = (id) => {
    Alert.alert(
      'Notu Sil',
      'Bu notu silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            const filteredNotes = notes.filter((note) => note.id !== id);
            setNotes(filteredNotes);
            if (editingNote && editingNote.id === id) {
              setEditingNote(null);
              setEditText('');
              setModalVisible(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleComplete = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(updatedNotes);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setEditText(note.text);
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    const trimmedText = editText.trim();
    if (trimmedText === '') {
      Alert.alert('Uyarı', 'Not boş olamaz.');
      return;
    }

    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id
        ? { ...note, text: trimmedText, date: new Date().toLocaleString() + ' (düzenlendi)' }
        : note
    );
    setNotes(updatedNotes);
    setModalVisible(false);
    setEditingNote(null);
    setEditText('');
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderNoteItem = ({ item }) => (
    <View style={[styles.noteCard, item.completed && styles.completedCard]}>
      <View style={styles.noteContent}>
        <View style={styles.noteHeader}>
          <Switch
            value={item.completed}
            onValueChange={() => handleToggleComplete(item.id)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={item.completed ? '#f5dd4b' : '#f4f3f4'}
          />
          <Text style={[styles.noteText, item.completed && styles.completedText]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.noteDate}>{item.date}</Text>
      </View>
      <View style={styles.noteActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditNote(item)}
        >
          <Text style={styles.buttonText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNote(item.id)}
        >
          <Text style={styles.buttonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.title}>Notlarım</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Yeni not girin..."
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleAddNote}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
                <Text style={styles.addButtonText}>Ekle</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Not ara..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {filteredNotes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery ? 'Aramanızla eşleşen not bulunamadı.' : 'Henüz not eklenmedi.'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredNotes}
                keyExtractor={(item) => item.id}
                renderItem={renderNoteItem}
                style={styles.list}
                showsVerticalScrollIndicator={false}
              />
            )}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
                setEditingNote(null);
                setEditText('');
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Notu Düzenle</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editText}
                    onChangeText={setEditText}
                    multiline
                    autoFocus
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => {
                        setModalVisible(false);
                        setEditingNote(null);
                        setEditText('');
                      }}
                    >
                      <Text style={styles.buttonText}>İptal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.saveButton]}
                      onPress={handleSaveEdit}
                    >
                      <Text style={styles.buttonText}>Kaydet</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  list: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: '#e8f5e9',
  },
  noteContent: {
    flex: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
});