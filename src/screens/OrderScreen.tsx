import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../api/api';

const OrderScreen: React.FC = () => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  const handleCreateOrder = async () => {
    try {
      const response = await api.post('/orders', {
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
      });
      /*
        Example create order response:
        {
          "message":"Order created successfully",
          "order": {
             "id":4,
             "user_id":25,
             "pickup_address":"123 Main St, Springfield",
             ...
          }
        }
      */
      const { order } = response.data;
      setOrderId(order.id);
      Alert.alert('Success', 'Order created successfully.');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to create order');
    }
  };

  const handleViewOrder = async () => {
    if (!orderId) {
      Alert.alert('No Order ID', 'Please create an order or set an order ID first');
      return;
    }
    try {
      const response = await api.get(`/orders/${orderId}`);
      /*
        Example view order response:
        {
          "order": {
            "id":4,
            "user_id":25,
            "pickup_address":"123 Main St, Springfield",
            ...
          }
        }
      */
      setOrderData(response.data.order);
      Alert.alert('Order Data', JSON.stringify(response.data.order, null, 2));
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to view order');
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

      <View style={{ marginTop: 20 }}>
        <Text style={styles.title}>View Order</Text>
        <TextInput
          placeholder="Order ID"
          style={styles.textInput}
          value={orderId ? String(orderId) : ''}
          onChangeText={(val) => setOrderId(Number(val))}
          keyboardType="numeric"
        />
        <Button title="View Order" onPress={handleViewOrder} />
      </View>

      {orderData && (
        <View style={{ marginTop: 20 }}>
          <Text>Order Info:</Text>
          <Text>ID: {orderData.id}</Text>
          <Text>Status: {orderData.status}</Text>
          <Text>Pickup: {orderData.pickup_address}</Text>
          <Text>Delivery: {orderData.delivery_address}</Text>
        </View>
      )}
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  textInput: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8, borderRadius: 4,
  },
});
