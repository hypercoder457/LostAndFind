import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from 'react';
import { Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CameraManager from "../CameraManager";
import LocalDataManager from "../LocalDataManager";
import LocationManager from "../LocationManager";
import styles from "../styles";

export default function LoadingScreen() {
    //AsyncStorage.clear();
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
            <Image source={require("../assets/loading.png")} style={{ width: 50, height: 50, marginBottom: 10 }} accessible={true} accessibilityRole="image" alt="Loading Icon"/>
            <Text style={{ marginTop: 10, fontSize: 24 }} accessible={true} accessibilityRole="text">Loading</Text>
        </SafeAreaView>
    );
};
