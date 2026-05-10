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

const COLORS = ['#FFD700', '#87CEFA', '#98FB98', '#FFB6C1', '#DDA0DD', '#FFA07A', '#20B2AA'];

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  const saveNotes = useCallback(async (updatedNotes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (e) {
      Alert.alert('Hata', 'Notlar kaydedilemedi');
    }
  }, []);

  const addNote = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Uyarı', 'Başlık ve içerik boş olamaz');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      date: new Date().toLocaleString(),
    };

    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setTitle('');
    setContent('');
    Keyboard.dismiss();
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
            const updatedNotes = notes.filter(note => note.id !== id);
            saveNotes(updatedNotes);
          }
        }
      ]
    );
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.noteContainer, { backgroundColor: item.color }]}
      onLongPress={() => deleteNote(item.id)}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent}>{item.content}</Text>
      <Text style={styles.noteDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.header}>Not Defteri</Text>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Notlarda ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredNotes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz not eklenmedi</Text>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            ref={titleRef}
            style={styles.input}
            placeholder="Başlık"
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={() => contentRef.current?.focus()}
            returnKeyType="next"
          />
          <TextInput
            ref={contentRef}
            style={[styles.input, styles.contentInput]}
            placeholder="İçerik"
            multiline
            value={content}
            onChangeText={setContent}
            blurOnSubmit={true}
          />
          <TouchableOpacity style={styles.addButton} onPress={addNote}>
            <Text style={styles.buttonText}>Not Ekle</Text>
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  noteContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  noteContent: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  contentInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;