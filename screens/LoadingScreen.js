import React from 'react';
import { SafeAreaView, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LocalDataManager from "../LocalDataManager";
import styles from "../styles";

export default function LoadingScreen() {
    const navigation = useNavigation();
    async function wait() {
        const results = await LocalDataManager.waitUntilUserDataLoaded();
        if (results) {
            navigation.navigate("Home Page");
        } else {
            navigation.navigate("Registration Page");
        }
    }
    wait();
    return (
        <SafeAreaView style={styles.loadingBackground}>
            <Image source={require("../assets/loading.png")} style={{ width: 50, height: 50, marginBottom: 10 }} />
            <Text style={{ marginTop: 10, fontSize: 24 }}>Loading</Text>
        </SafeAreaView>
    );
};
