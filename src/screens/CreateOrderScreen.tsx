import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import api from '../api/api';

const CreateOrderScreen = () => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleCreateOrder = async () => {
    try {
      const response = await api.post('/orders', {
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
      });
      Alert.alert('Success', 'Order created successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to create order');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Order</Text>
      <TextInput
        placeholder="Pickup Address"
        style={styles.textInput}
        value={pickupAddress}
        onChangeText={setPickupAddress}
      />
      <TextInput
        placeholder="Delivery Address"
        style={styles.textInput}
        value={deliveryAddress}
        onChangeText={setDeliveryAddress}
      />
      <Button title="Create Order" onPress={handleCreateOrder} />
    </View>
  );
};

export default CreateOrderScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  textInput: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8, borderRadius: 4 },
});
