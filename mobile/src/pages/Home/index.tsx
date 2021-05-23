import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Image, Text, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { Translate } from '../../Internacionalization/PT_BR';
import { styles } from './style';
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

const Home = () => {

    interface UFIBGEResponse {
        sigla: string;
    }

    interface CityIBGEResponse {
        nome: string;
    }

    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');

    const navigation = useNavigation();

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);


    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf,
            city
        })
    }

    useEffect(() => {
        axios.get<UFIBGEResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setUfs(ufInitials);
        });
    }, [])

    useEffect(() => {

        if (uf === '0') {
            return;
        }

        axios.get<CityIBGEResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames);
        });

    }, [uf])

    const placeholderUf = {
        label: 'Selecione o estado',
        value: null,
        color: '#9EA0A4',
    };

    const placeholderCity = {
        label: 'Selecione a cidade',
        value: null,
        color: '#9EA0A4',
    };

    return (
        <ImageBackground source={require('../../assets/pets.png')} style={styles.container} imageStyle={{ width: 314, height: 314, marginTop: 100, marginLeft: 40 }}>
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <View>
                    <Text style={styles.title}>{Translate.map(app => app.Home.TITLE_HOME)}</Text>
                    <Text style={styles.description}>{Translate.map(app => app.Home.DESCRIPTION)}</Text>
                </View>
            </View>

            <RNPickerSelect
                onValueChange={setUf}
                useNativeAndroidPickerStyle={true}
                value={uf}
                style={pickerSelectStyles}
                placeholder={placeholderUf}
                items={ufs.map(uf => (
                    { label: uf, value: uf }
                ))}
            />

            <RNPickerSelect
                onValueChange={setCity}
                value={city}
                style={pickerSelectStyles}
                placeholder={placeholderCity}
                items={cities.map(city => (
                    { label: city, value: city }
                ))}
            />

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text >
                            <AntDesign name="arrowright" size={24} color="#FFF" />
                        </Text>
                    </View>
                    <Text style={styles.buttonText} >{Translate.map(app => app.Home.FIND)}</Text>
                </RectButton>
            </View>
        </ImageBackground>
    )
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 24,
        marginTop: 8,
        fontSize: 16,
    },
    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 24,
        marginTop: 8,
        fontSize: 16,
        color: '#000',
    },
});

export default Home;