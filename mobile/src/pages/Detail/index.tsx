import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, Linking, ScrollView } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native";
import { RectButton } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import api from '../../services/api'
import * as MailComposer from 'expo-mail-composer';

interface Params {
  point_id: number;
}

interface Data {
  serializedPoint: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
    address: string;
    services: string;
    phone: string;
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {

  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParms = route.params as Params;

  useEffect(() => {
    const id = `${routeParms.point_id}`;
    api.get(`points/${id}`).then(response => {
      const data = (response.data);
      setData(data);
    })
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Contato via I-PET',
      recipients: [data.serializedPoint.email]
    })
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=+55${data.serializedPoint.whatsapp}&text=Olá, Estou entrando em contato via I-PET.`)
  }

  if (!data.serializedPoint) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleNavigateBack}>
              <Icon name="arrow-left" size={25} color="#47D4AC" />
            </TouchableOpacity>
          </View>

          <Image style={styles.image} source={require('../../assets/logo.png')} />

          <Image style={styles.pointImage} source={{ uri: data.serializedPoint.image_url }} />
          <Text style={styles.pointName}>{data.serializedPoint.name}</Text>
          <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>
          <View style={styles.address}>
            <Text style={styles.addressTitle}>Serviços</Text>
            <Text style={styles.addressContent}>{data.serializedPoint.services}</Text>
          </View>
          <View style={styles.address}>
            <Text style={styles.addressTitle}>Endereço</Text>
            <Text style={styles.addressContent}>{data.serializedPoint.address}</Text>
          </View>
          <View style={styles.address}>
            <Text style={styles.addressTitle}>Telefone</Text>
            <Text style={styles.addressContent}>{data.serializedPoint.phone}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#002B49" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#002B49" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 16,
  },

  pointName: {
    color: '#002B49',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 10,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 18,
    lineHeight: 24,
    marginTop: 4,
    color: '#47D4AC'
  },

  address: {
    marginTop: 16,
  },

  addressTitle: {
    color: '#002B49',
    fontFamily: 'Roboto_500Medium',
    fontSize: 18,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 2,
    color: '#002B49',
    fontSize: 15,
    paddingBottom: 0,
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header: {
    marginTop: Constants.statusBarHeight - 14
  },

  button: {
    width: '48%',
    backgroundColor: '#47D4AC',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#002B49',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
  image: {
    flex: 1,
    width: '34%',
    height: "34%",
    resizeMode: 'contain',
    position: 'absolute',
    right: 20,
    top: -50,
  }
});

export default Detail;