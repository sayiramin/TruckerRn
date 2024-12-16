import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import api from '../api/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OrderListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All'); // Default status
  const [loading, setLoading] = useState(false); // Pull-to-refresh loading state


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true); 
      const response = await api.get('/orders'); // Replace with your API endpoint
      setOrders(response.data.orders || []);
      setFilteredOrders(response.data.orders || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch orders');
      console.error('Error fetching orders:', error);
    }finally{
      setLoading(false);
    }
  };

  // Filter orders based on status and search query
  const filterOrders = () => {
    let updatedOrders = orders;

    // Filter by status
    if (selectedStatus !== 'All') {
      updatedOrders = updatedOrders.filter(
        (order) => order.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Filter by search query (on order ID)
    if (searchQuery) {
      updatedOrders = updatedOrders.filter((order) =>
        String(order.id).includes(searchQuery)
      );
    }

    setFilteredOrders(updatedOrders);
  };

  useEffect(() => {
    filterOrders();
  }, [searchQuery, selectedStatus]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.orderContainer}>
      <View style={styles.iconContainer}>
        <Icon name="package-variant-closed" size={30} color="#ff7043" />
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderNumber}>{item.id}</Text>
        <Text style={styles.orderInfo}>
          {item.pickup_address} → {item.delivery_address}
        </Text>
        <Text style={styles.orderInfo}>
          Weight: {item.weight}kg | Size: {item.size}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, getStatusStyle(item.status)]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { color: '#4caf50' };
      case 'pending':
        return { color: '#ff9800' };
      case 'on process':
        return { color: '#03a9f4' };
      default:
        return { color: '#000' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Enter track number"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        {['All', 'Pending', 'On Process', 'Delivered'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.tab,
              selectedStatus === status && styles.activeTab,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.tabText,
                selectedStatus === status && styles.activeTabText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Full-width Button for Creating Shipment */}
      {/* <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Order')}
      >
        <Text style={styles.createButtonText}>Create a Shipment</Text>
      </TouchableOpacity> */}

      {/* FlatList for displaying orders */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshing={loading} // Pull-to-refresh state
        onRefresh={fetchOrders} //
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#ff7043',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#ff7043',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default OrderListScreen;
