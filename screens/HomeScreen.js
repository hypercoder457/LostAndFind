import React from "react";
import { Text, View, Image, Pressable, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import LocalDataManager from "../LocalDataManager";
import styles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen(props) {
    //AsyncStorage.clear();

    const navigation = useNavigation();

    function canReportAnItem() {
        if (LocalDataManager.dataLoaded) {
            if ("tBNP" in LocalDataManager.userData) {
                const tBNP = parseInt(LocalDataManager.userData.tBNP);
                const currentDate = new Date();
                const currentTime = parseInt(currentDate.getTime());
                if (tBNP > currentTime) {
                    const secondsLeft = Math.ceil((tBNP - currentTime) * 0.001);
                    Alert.alert("Notice", "You can report another missing item in " + secondsLeft + " seconds!");
                } else {
                    navigation.navigate("Report An Item");
                }
            }
        }
    }

    return (
        <View>
            <SafeAreaView style={{ height: "10%", width: "100%", backgroundColor: "rgb(0, 175, 229)", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 40, position: "absolute", bottom: "5%" }}>Home Page</Text>
            </SafeAreaView>
            <ScrollView bounces={false} style={{ height: "90%", backgroundColor: "rgb(96, 218, 255)" }}>
                <Pressable style={{marginTop: 50,height: 100, width: "95%", marginLeft: "2.5%", display: "flex", flexDirection: "row"}} onPress={() => {navigation.navigate("Recover An Item")}}>
                    <Image source={require("../assets/searchIcon.png")} style={{height: 100, width: 100, padding: 5, backgroundColor: "rgb(0, 175, 229)", borderColor: "rgb(0, 129, 168)", borderWidth: 2, borderRadius: 25}}/>
                    <View style={{flex: 2, backgroundColor: "rgb(128, 225, 255)", fontSize: 25, borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10, justifyContent: "center"}}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize: 40, textAlign: "center"}}>Recover an Item</Text>
                        <Text adjustsFontSizeToFit numberOfLines={2} style={{fontSize: 18, textAlign: "center"}}>Search and recover missing items!</Text>
                    </View>
                </Pressable>
                <Pressable style={{marginTop: 50, height: 100, width: "95%", marginLeft: "2.5%", display: "flex", flexDirection: "row"}} onPress={() => {canReportAnItem()}}>
                    <Image source={require("../assets/cameraIcon.png")} style={{height: 100, width: 100, padding: 5, backgroundColor: "rgb(0, 175, 229)", borderColor: "rgb(0, 129, 168)", borderWidth: 2, borderRadius: 25}}/>
                    <View style={{flex: 2, backgroundColor: "rgb(128, 225, 255)", fontSize: 25, borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10, justifyContent: "center"}}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize: 40, textAlign: "center"}}>Report an Item</Text>
                        <Text adjustsFontSizeToFit numberOfLines={2} style={{fontSize: 18, textAlign: "center"}}>Report missing items!</Text>
                    </View>
                </Pressable>
                <Pressable style={{marginTop: 50, height: 100, width: "95%", marginLeft: "2.5%", display: "flex", flexDirection: "row"}} onPress={() => {navigation.navigate("Edit Screen")}}>
                    <Image source={require("../assets/editIcon.png")} style={{height: 100, width: 100, padding: 5, backgroundColor: "rgb(0, 175, 229)", borderColor: "rgb(0, 129, 168)", borderWidth: 2, borderRadius: 25}}/>
                    <View style={{flex: 2, backgroundColor: "rgb(128, 225, 255)", fontSize: 25, borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10, justifyContent: "center"}}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize: 40, textAlign: "center"}}>Edit a Report</Text>
                        <Text adjustsFontSizeToFit numberOfLines={2} style={{fontSize: 18, textAlign: "center"}}>Fix or edit a report!</Text>
                    </View>
                </Pressable>
                <View style={{alignItems: "center", marginTop: 100 }}>
                    <Image source={require("../assets/logo.png")} style={{height: "200", width: "200"}}/>
                </View>
            </ScrollView>
        </View>
    );
}