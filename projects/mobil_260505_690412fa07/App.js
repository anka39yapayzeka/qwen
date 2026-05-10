import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  LayoutAnimation,
  UIManager,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = ['#FFFFFF', '#FFF9C4', '#BBDEFB', '#C8E6C9', '#F8BBD0', '#E1BEE7', '#FFCCBC', '#B2DFDB'];

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch (e) {
      Alert.alert('Hata', 'Notlar yüklenemedi');
    }
  };

  const saveNotesToStorage = useCallback(async (updatedNotes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (e) {
      Alert.alert('Hata', 'Notlar kaydedilemedi');
    }
  }, []);

  const handleSaveNote = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Uyarı', 'Başlık ve içerik boş olamaz');
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    let updatedNotes;
    const currentDate = new Date().toLocaleString('tr-TR', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    if (editingId) {
      updatedNotes = notes.map(note => 
        note.id === editingId 
          ? { ...note, title: title.trim(), content: content.trim(), color: selectedColor, updatedAt: currentDate }
          : note
      );
    } else {
      const newNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        color: selectedColor,
        date: currentDate,
        updatedAt: currentDate,
        isPinned: false,
      };
      updatedNotes = [newNote, ...notes];
    }

    saveNotesToStorage(updatedNotes);
    resetForm();
    Keyboard.dismiss();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setSelectedColor(COLORS[0]);
  };

  const editNote = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedColor(note.color || COLORS[0]);
    titleRef.current?.focus();
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
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const updatedNotes = notes.filter(note => note.id !== id);
            saveNotesToStorage(updatedNotes);
            if (editingId === id) resetForm();
          }
        }
      ]
    );
  };

  const togglePin = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    );
    saveNotesToStorage(updatedNotes);
  };

  const filteredAndSortedNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        return new Date(b.id).getTime() < new Date(a.id).getTime() ? -1 : 1;
      }
      return a.isPinned ? -1 : 1;
    });

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.noteContainer, { backgroundColor: item.color || '#fff' }]}
      onPress={() => editNote(item)}
      activeOpacity={0.7}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => togglePin(item.id)} style={styles.iconButton}>
            <Text style={{ fontSize: 16 }}>{item.isPinned ? '📌' : '📍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.iconButton}>
            <Text style={{ fontSize: 16, color: '#e74c3c' }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.noteContent} numberOfLines={4}>{item.content}</Text>
      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>{item.updatedAt || item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.header}>Not Defteri</Text>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Notlarda ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✖</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredAndSortedNotes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Sonuç bulunamadı' : 'Henüz not eklenmedi'}
              </Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          {editingId && (
            <View style={styles.editHeader}>
              <Text style={styles.editText}>✏️ Not Düzenleniyor</Text>
              <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
            {COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </ScrollView>

          <TextInput
            ref={titleRef}
            style={styles.input}
            placeholder="Başlık"
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={() => contentRef.current?.focus()}
            returnKeyType="next"
            placeholderTextColor="#999"
          />
          <TextInput
            ref={contentRef}
            style={[styles.input, styles.contentInput]}
            placeholder="İçerik"
            multiline
            value={content}
            onChangeText={setContent}
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={[styles.addButton, editingId && styles.updateButton]} 
            onPress={handleSaveNote}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{editingId ? 'Notu Güncelle' : 'Not Ekle'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  clearIcon: {
    fontSize: 14,
    color: '#999',
    padding: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noteContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
  noteContent: {
    fontSize: 15,
    marginBottom: 12,
    color: '#555',
    lineHeight: 22,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  noteDate: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.4,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  editText: {
    color: '#e67e22',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cancelText: {
    color: '#e74c3c',
    fontWeight: '700',
    fontSize: 13,
  },
  colorPicker: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#333',
    transform: [{ scale: 1.1 }],
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    color: '#333',
  },
  contentInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: '#e67e22',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default App;