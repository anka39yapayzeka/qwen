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
    if (notes.length > ) {
      saveNotes(notes);
    }
  }, [notes]);

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
      { cancelable: