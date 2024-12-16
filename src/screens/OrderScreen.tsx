import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../api/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const OrderScreen: React.FC = () => {
  const navigation = useNavigation(); // Access navigation for redirection

  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupTime, setPickupTime] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<string>('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');

  const [isPickupTimePickerVisible, setIsPickupTimePickerVisible] = useState(false);
  const [isDeliveryTimePickerVisible, setIsDeliveryTimePickerVisible] = useState(false);

  const handleCreateOrder = async () => {
    try {
      const response = await api.post('/orders', {
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        pickup_time: pickupTime,
        delivery_time: deliveryTime,
        weight,
        size,
      });

      Alert.alert('Success', 'Order created successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('OrderList'), // Redirect to Order List
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to create order');
    }
  };

  const showPickupTimePicker = () => setIsPickupTimePickerVisible(true);
  const hidePickupTimePicker = () => setIsPickupTimePickerVisible(false);

  const handlePickupTimeConfirm = (date: Date) => {
    setPickupTime(moment(date).format('YYYY-MM-DD HH:mm'));
    hidePickupTimePicker();
  };

  const showDeliveryTimePicker = () => setIsDeliveryTimePickerVisible(true);
  const hideDeliveryTimePicker = () => setIsDeliveryTimePickerVisible(false);

  const handleDeliveryTimeConfirm = (date: Date) => {
    setDeliveryTime(moment(date).format('YYYY-MM-DD HH:mm'));
    hideDeliveryTimePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Pickup Address */}
      <View style={styles.inputContainer}>
        <Icon name="map-marker" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Pickup Address"
          style={styles.textInput}
          value={pickupAddress}
          onChangeText={setPickupAddress}
        />
      </View>

      {/* Delivery Address */}
      <View style={styles.inputContainer}>
        <Icon name="map-marker-outline" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Delivery Address"
          style={styles.textInput}
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
        />
      </View>

      {/* Pickup Time */}
      <TouchableOpacity style={styles.inputContainer} onPress={showPickupTimePicker}>
        <Icon name="clock-outline" size={20} color="#999" style={styles.icon} />
        <Text style={styles.textInput}>
          {pickupTime ? pickupTime : 'Select Pickup Time'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isPickupTimePickerVisible}
        mode="datetime"
        onConfirm={handlePickupTimeConfirm}
        onCancel={hidePickupTimePicker}
      />

      {/* Delivery Time */}
      <TouchableOpacity style={styles.inputContainer} onPress={showDeliveryTimePicker}>
        <Icon name="clock" size={20} color="#999" style={styles.icon} />
        <Text style={styles.textInput}>
          {deliveryTime ? deliveryTime : 'Select Delivery Time'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDeliveryTimePickerVisible}
        mode="datetime"
        onConfirm={handleDeliveryTimeConfirm}
        onCancel={hideDeliveryTimePicker}
      />

      {/* Weight */}
      <View style={styles.inputContainer}>
        <Icon name="weight" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Weight (kg)"
          style={styles.textInput}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
      </View>

      {/* Size */}
      <View style={styles.inputContainer}>
        <Icon name="arrow-expand" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Size"
          style={styles.textInput}
          value={size}
          onChangeText={setSize}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleCreateOrder}>
        <Text style={styles.buttonText}>Submit Shipment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
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
    backgroundColor: '#ff7043',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderScreen;
