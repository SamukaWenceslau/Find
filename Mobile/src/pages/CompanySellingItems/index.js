import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import RoundedButton from '../../components/RoundedButton';

import styles from './styles';
import colors from '../../assets/var/colors';

import { MaterialIcons } from '@expo/vector-icons'; 

import { adjustHorizontalMeasure } from '../../utils/adjustMeasures';
import adjustFontSize from '../../utils/adjustFontSize';

import ProductCard from '../../components/ProductCard';
import CircleButton from '../../components/CircleButton';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/auth'

import api from '../../services/api';

const CompanySellingItems = (props) => {
  const navigation = useNavigation()

  const [sellingItemsData, setSellingItemsData] = useState({});

  const {loggedUser} = useAuth();

  const fetchCompanySellingItems = async () => {
    const user = loggedUser;
    const response = await api.get(`/my-products/${user.data.id}`)
    setSellingItemsData(response.data);
  }

  const navigateToProductManagement = () => {
    navigation.navigate('NewProduct');
  }

  useEffect(() => {
    fetchCompanySellingItems();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerButtonContainer}>
          <TouchableOpacity 
            style={styles.orderButton}
            onPress={props.onPress}
          >
            <Text style={styles.orderButtonText}>Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceListButton}>
            <Text style={styles.serviceListButtonText}>Meus Serviços</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.companySellingItemsContainer}>
          <FlatList 
            data={sellingItemsData}
            keyExtractor={(item, index) => item + index}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProductCard 
                Title={item.name}
                Price={item.price}
                Image={item.img_url}
                Description={item.description}
              />
            )}
          />
        </View>
        <View style={styles.addButtonContainer}>
          <CircleButton 
            onPress={() => navigateToProductManagement()} 
            style={styles.button}
            fontSize={52} 
            selected={true} 
            width={52}
            height={52}
          />
        </View>
      </View>
    </View>
  );
}

export default CompanySellingItems;