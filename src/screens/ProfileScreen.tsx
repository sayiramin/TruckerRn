import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    fetchProfile();
  });

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      /*
        Example profile success response:
        {
          "user": {
            "id":25,
            "name":"John Doe",
            "email":"johndoe@example.com",
            ...
          }
        }
      */
      const userData = response.data.user;
      setName(userData.name);
      setEmail(userData.email);
      setUser(userData);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch profile');
    }
  };

  const updateProfile = async () => {
    try {
      const response = await api.put('/profile', { name, email });
      // You might get a similar success message or the updated user object
      Alert.alert('Success', 'Profile updated successfully');
      // Optionally, refetch or update context
      fetchProfile();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <TextInput
        placeholder="Name"
        style={styles.textInput}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  textInput: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8, borderRadius: 4,
  },
});
