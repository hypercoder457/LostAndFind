import React from "react";
import { Text, View, Image, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import LocalDataManager from "../LocalDataManager";
import styles from "../styles";

export default function HomeScreen(props) {
    const navigation = useNavigation();
    
    function canReportAnItem() {
        if (LocalDataManager.dataLoaded) {
            if ("tBNP" in LocalDataManager.userData) {
                const tBNP = parseInt(LocalDataManager.userData.tBNP);
                const currentDate = new Date();
                const  currentTime = parseInt(currentDate.getTime());
                if (tBNP > currentTime) {
                    const secondsLeft = Math.ceil((tBNP - currentTime) * 0.001);
                    Alert.alert("Notice", "You can report another missing item in "+secondsLeft+" seconds!");
                } else {
                    navigation.navigate("Report An Item");
                }
            }
        }
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{ display: "flex", justifyItems: "center", alignItems: "center", height: "auto" }}>
                <Text style={{ fontSize: 50 }}>Lost & Find</Text>
            </View>
            <View style={{ backgroundColor: "rgb(121, 157, 150)", display: "flex", alignItems: "center", justifyItems: "center", borderRadius: 5 }}>
                <Pressable style={styles.mainOptionIcon} onPress={() => {navigation.navigate("Recover An Item");}}>
                    <Image source={require("../assets/searchIcon.png")} style={styles.icon} />
                    <Text style={styles.textWithIcon}>Recover</Text>
                </Pressable>
                <Pressable style={styles.mainOptionIcon} onPress={() => {canReportAnItem()}}>
                    <Image source={require("../assets/cameraIcon.png")} style={styles.icon} />
                    <Text style={styles.textWithIcon}>Report</Text>
                </Pressable>
                <Pressable style={styles.mainOptionIcon} onPress={() => {navigation.navigate("Edit Screen");}}>
                    <Image source={require("../assets/editIcon.png")} style={styles.icon} />
                    <Text style={styles.textWithIcon}>Edit</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}