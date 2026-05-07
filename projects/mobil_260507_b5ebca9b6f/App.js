), titles, or Turkish sentences before or after the code.
    *   Constraint 3: Must not start with "Yes", "Here", "Below", etc. The first semantic line must be code (usually `import`).
    *   Constraint 4: `export default` containing a full App component is mandatory.
    *   Constraint 5: No text outside the code, even a single letter.
    *   User Request: Simple Notepad app.
    *   Internal Analysis (provided in prompt): Use `AsyncStorage`, `FlatList`, `useState`, `useEffect`, `SafeAreaView`, `TextInput`, `TouchableOpacity`. Handle empty inputs, data persistence, and basic styling.

    *   Imports: `React`, `useState`, `useEffect` from `react`; `StyleSheet`, `Text`, `View`, `TextInput`, `TouchableOpacity`, `FlatList`, `SafeAreaView`, `KeyboardAvoidingView`, `Platform`, `Alert` from `react-native`; `AsyncStorage` from `@react-native-async-storage/async-storage`.
    *   State: `notes` (array), `text` (string).
    *   Functions:
        *   `loadNotes`: Fetch from AsyncStorage on mount.
        *   `saveNotes`: Save current `notes` state to AsyncStorage.
        *   `addNote`: Validate `text.trim()`, create object `{id: Date.now().toString(), text}`, update state, save.
        *   `deleteNote`: Filter by id, update state, save.
    *   UI:
        *   `SafeAreaView` wrapper.
        *   Header.
        *   Input section (TextInput + Add Button).
        *   FlatList for notes.
        *   Empty state message.
    *   Styling: Modern, clean, using `StyleSheet`.

    *   Ensure no markdown fences.
    *   Ensure no introductory text.
    *   Ensure `export default App`.

    *   *Self-Correction during drafting:* I must remember that `@react-native-async-storage/async-storage` is the standard for Expo now, not the deprecated `AsyncStorage` from `react-native`.

    *   `import React, { useState, useEffect } from 'react';`
    *   `import { ... } from 'react-native';`
    *   `import AsyncStorage from '@react-native-async-storage/async-storage';`
    *   `const App = () => { ... }`
    *   `export default App;`

    *   Check: No