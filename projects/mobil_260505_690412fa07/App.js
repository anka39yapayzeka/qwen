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

const COLORS = ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6', '#34495e'];

function formatRelativeDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));
  const time = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  if (diffDays === 0) return `Bugün, ${time}`;
  if (diffDays === 1) return `Dün, ${time}`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) + `, ${time}`;
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const inputRef = useRef(null);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    saveNotes();
  }, [notes]);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem('notes');
      if (stored !== null) setNotes(JSON.parse(stored));
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

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;
    const term = search.toLowerCase();
    return notes.filter((n) => n.text.toLowerCase().includes(term));
  }, [notes, search]);

  const addOrUpdateNote = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId ? { ...n, text: trimmed, color: selectedColor } : n
        )
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now().toString(),
        text: trimmed,
        date: new Date().toISOString(),
        color: selectedColor,
      };
      setNotes([newNote, ...notes]);
    }

    setText('');
    setSelectedColor(COLORS[0]);
    Keyboard.dismiss();
  };

  const deleteNote = (id) => {
    Alert.alert('Notu Sil', 'Bu notu silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => setNotes((prev) => prev.filter((n) => n.id !== id)),
      },
    ]);
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setText(note.text);
    setSelectedColor(note.color || COLORS[0]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setText('');
    setSelectedColor(COLORS[0]);
    Keyboard.dismiss();
  };

  const todayTitle = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a252f" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Not Defterim</Text>
          <Text style={styles.headerDate}>{todayTitle}</Text>
          <Text style={styles.headerSubtitle}>
            {search.trim() ? `${filteredNotes.length} sonuç` : `${notes.length} not`}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Notlarınızda ara..."
            placeholderTextColor="#95a5a6"
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.colorPicker}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c },
                  selectedColor === c && styles.colorCircleActive,
                ]}
                onPress={() => setSelectedColor(c)}
              />
            ))}
          </View>

          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={editingId ? 'Notu düzenleyin...' : 'Yeni not yazın...'}
            placeholderTextColor="#95a5a6"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />

          <View style={styles.inputMeta}>
            <Text style={styles.charCount}>{text.length}/500</Text>
          </View>

          {editingId ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelEdit}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  !text.trim() && styles.addButtonDisabled,
                ]}
                onPress={addOrUpdateNote}
                disabled={!text.trim()}
              >
                <Text style={styles.addButtonText}>Güncelle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
              onPress={addOrUpdateNote}
              disabled={!text.trim()}
            >
              <Text style={styles.addButtonText}>Ekle</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {search.trim() ? 'Eşleşen not bulunamadı.' : 'Henüz not eklenmedi.'}
              </Text>
              {!search.trim() && (
                <Text style={styles.emptySubtext}>
                  Yukarıdan ilk notunuzu oluşturabilirsiniz.
                </Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <View
                style={[
                  styles.colorStrip,
                  { backgroundColor: item.color || COLORS[0] },
                ]}
              />
              <TouchableOpacity
                style={styles.noteTouchable}
                onPress={() => startEditing(item)}
                activeOpacity={0.7}
              >
                <View style={styles.noteTextArea}>
                  <Text style={styles.noteText}>{item.text}</Text>
                  <Text style={styles.noteDate}>
                    {formatRelativeDate(item.date)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtnWrap}
                onPress={() => deleteNote(item.id)}
              >
                <View style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>×</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    backgroundColor: '#1a252f',
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerDate: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 6,
  },
  searchContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    height: 44,
    fontSize: 15,
    color: '#2c3e50',
  },
  inputContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorPicker: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorCircleActive: {
    borderColor: '#2c3e50',
  },
  input: {
    fontSize: 16,
    color: '#2c3e50',
    minHeight: 70,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  inputMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    marginBottom: 4,
  },
  charCount: {
    fontSize: 11,
    color: '#95a5a6',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  colorStrip: {
    width: 4,
    alignSelf: 'stretch',
  },
  noteTouchable: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  noteTextArea: {
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
  deleteBtnWrap: {
    padding: 10,
    paddingLeft: 4,
    marginTop: 4,
    marginRight: 2,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 6,
    textAlign: 'center',
  },
});
