import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen: React.FC = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || ''); // Email is read-only
  const [phone, setPhone] = useState(user?.phone || ''); // Added phone field

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      const userData = response.data.user;
      setName(userData.name);
      setEmail(userData.email);
      setPhone(userData.phone || '');
      setUser(userData);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch profile');
    }
  };

  const updateProfile = async () => {
    try {
      const response = await api.put('/profile', { name, phone });
      Alert.alert('Success', 'Profile updated successfully');
      fetchProfile(); // Refresh user details
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Name Field */}
      <View style={styles.inputContainer}>
        <Icon name="account" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Name"
          style={styles.textInput}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Field (Read-Only) */}
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Email"
          style={[styles.textInput, { color: '#aaa' }]} // Dim color to show it's read-only
          value={email}
          editable={false} // Make it unchangeable
        />
      </View>

      {/* Phone Field */}
      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Phone Number"
          style={styles.textInput}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Update Profile Button */}
      <TouchableOpacity style={styles.button} onPress={updateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#ff6600',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
