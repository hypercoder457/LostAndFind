import React, { useEffect } from 'react';
import { Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import LocalDataManager from "../LocalDataManager";
import CameraManager from "../CameraManager";
import LocationManager from "../LocationManager";
import styles from "../styles";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoadingScreen() {
    LocalDataManager.loadUserData();
    CameraManager.checkPermission();
    LocationManager.checkPermission();
    const navigation = useNavigation();
    async function wait() {
        const results = await LocalDataManager.waitUntilUserDataLoaded();
        if (results) {
            navigation.replace("Home Page");
        } else {
            navigation.replace("Log In");
        }
    }
    useEffect(() => {
        wait();
    });
    return (
        <SafeAreaView style={styles.loadingBackground}>
            <Image source={require("../assets/loading.png")} style={{ width: 50, height: 50, marginBottom: 10 }} />
            <Text style={{ marginTop: 10, fontSize: 24 }}>Loading</Text>
        </SafeAreaView>
    );
};
