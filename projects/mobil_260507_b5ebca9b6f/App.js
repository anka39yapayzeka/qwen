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

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('@my_notes');
      if (savedNotes !==) {
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
      completed:,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setInputText('');
    Keyboard.dismiss();
  };

  const handleDeleteNote = (id) => {
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);
    saveNotes(filteredNotes);
  };

  const handleToggleComplete = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
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
    saveNotes(updatedNotes);
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
            trackColor={{: '#