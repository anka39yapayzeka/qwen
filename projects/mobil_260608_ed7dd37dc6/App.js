import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const choices = ['Taş', 'Kağıt', 'Makas'];

const getComputerChoice = () => choices[