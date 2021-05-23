import React, { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from 'react-native-maps';
import { SvgUri as Svg } from 'react-native-svg';
import api from '../../services/api';
import axios from 'axios'

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: string;
  longitude: string;
}

interface Params {
  uf: number;
  city: string;
}




const Points = () => {

  const navigation = useNavigation();

  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const route = useRoute();

  const routeParms = route.params as Params;

  useEffect(() => {
    async function loadPosition() {
      axios.get(`https://geocode.search.hereapi.com/v1/geocode?q=${routeParms.uf}+${routeParms.city}&apikey=i2a6F4RTvYOzSV13QJdgudZv5GGOd9oFJ79AQc3UYWY`).then(response => {
        const {items} = response.data;

        const latitude = parseFloat(items.map((item: any) => item.position.lat.toString()));
        const longitude = parseFloat(items.map((item: any) => item.position.lng.toString()));

        setInitialPosition([
          latitude,
          longitude
        ])
      });

    }
    loadPosition();
  }, [])

  useEffect(() => {
    axios.get<any[]>('http://ipet-backend.herokuapp.com/items').then(response => {
      const items = response.data;
      setItems(items)
    });

  }, []);


  useEffect(() => {
    const fetchData = async () => {
      axios.get(`http://ipet-backend.herokuapp.com/points?city=${routeParms.city}&uf=${routeParms.uf}&items=${selectedItems}`).then(response => {
        const { serializedPoints } = (response.data);
        setPoints(serializedPoints);
      });
    }

    fetchData();

  }, [selectedItems]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { point_id: id });
  }

  function handleSelectItem(id: number) {

    if (selectedItems.includes(id)) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
      return;
    }
    if (!selectedItems.includes(id)) {
      setSelectedItems([...selectedItems, id])
      return;
    }
  }


  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={25} color="#47D4AC" />
          </TouchableOpacity>
        </View>

        <Image style={styles.image} source={require('../../assets/logo.png')} />

        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.description}>Selecione e encontre no mapa um estabelecimento</Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              style={styles.map}
            >
              {selectedItems[0] !== undefined && (points.map(point => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate={{
                    latitude: Number(point.latitude),
                    longitude: Number(point.longitude),
                  }} >
                  <View style={styles.mapMarkerContainer}>
                    <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                    <Text style={styles.mapMarkerTitle} >{point.name}</Text>
                  </View>
                </Marker>
              )))}

            </MapView>
          )}

          {initialPosition[0] === 0 && (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#47D4AC" />
              <Text style={styles.itemTitle}>Carregando...</Text>
            </View>
          )}

        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 32 }}>
          {items.map(item => (
            <TouchableOpacity key={String(item.id)} style={[styles.item, selectedItems.includes(item.id) ? styles.selectedItem : {}]} onPress={() => handleSelectItem(item.id)} activeOpacity={0.6}>
              <Svg width={55} height={55} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}

        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    color: '#002B49',
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 10,
  },
  header: {
    marginTop: Constants.statusBarHeight - 32
  },

  description: {
    color: '#002B49',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 20,
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
    borderColor: '#BFBFBF',
    borderWidth: 1,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#47D4AC',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#002B49',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
  },

  item: {
    backgroundColor: '#47D4AC',
    borderWidth: 2,
    borderColor: '#47D4AC',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#002B49',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Ubuntu_700Bold',
    textAlign: 'center',
    fontSize: 13,
    color: '#002B49',
  },

  image: {
    flex: 1,
    width: '34%',
    height: "34%",
    resizeMode: 'contain',
    position: 'absolute',
    right: 20,
    top: Constants.statusBarHeight - 60
  }
});

export default Points;