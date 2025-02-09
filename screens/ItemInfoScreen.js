import React, { use, useState, useRef, useEffect } from "react";
import Checkbox from 'expo-checkbox';
import { useNavigation } from "@react-navigation/native";
import { Image, Dimensions, ScrollView, TouchableHighlight, View, TextInput, StyleSheet, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { SelectList } from 'react-native-dropdown-select-list';
import { set } from "lodash";

import LocalDataManager from "../LocalDataManager";
import DatabaseManager from "../DatabaseManager";

const windowDimensions = Dimensions.get('window');

export default function ItemInfoScreen(info) {
    const navigation = useNavigation();

    const [imagesLoaded, setImagesLoaded] = React.useState({});
    const [foundItem, setFoundItem] = React.useState(false);

    const entryPath = info.route.params.path;
    const entryKey = info.route.params.key;
    const entryData = info.route.params.data;

    useEffect(() => {
        async function checkIfExpired() {
            let results = await DatabaseManager.hasEntry(entryPath+"/"+entryKey);
            if (!results) {
                navigation.goBack();
                Alert.alert("Notice", "This entry no longer exists");
            }
        }
        checkIfExpired();
    });

    async function handleFind() {
        if (!LocalDataManager.dataLoaded) {
            return;
        }

        if ("tBNF" in LocalDataManager.userData && "foundReports" in LocalDataManager.userData) {
            const tBNF = parseInt(LocalDataManager.userData.tBNF);
            const currentDate = new Date();
            const currentTime = parseInt(currentDate.getTime());
            if (tBNF > currentTime) {
                const minutesLeft = Math.ceil((tBNF - currentTime)/60000);
                Alert.alert("Notice", "You can report another item found in " + minutesLeft + " minutes!");
            } else {
                const currentDate = new Date();
                const currentTime = parseInt(currentDate.getTime());
                const futureTime = currentTime + 1800000;
                const stringFutureTime = futureTime.toString();

                LocalDataManager.updateUserData("tBNF", stringFutureTime);
                LocalDataManager.saveUserData();

                LocalDataManager.updateUserData("foundReports", entryPath+"/"+entryKey);
                LocalDataManager.saveUserData();

                const numberExperationDate = parseInt(entryData.experationDate);
                if ((currentTime + 1209600000) < numberExperationDate) {
                    DatabaseManager.reduceExperationTime(entryPath+"/"+entryKey+"/experationDate", (currentTime + 1209600000).toString())
                }
                setFoundItem(true);
            }
        }
    }

    return (
        <View>
            <View style={{ height: "10%", width: "100%", backgroundColor: "rgb(0, 175, 229)", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: "center", width: "90%", fontSize: 40, position: "absolute", bottom: "5%" }}>{entryData.itemName}</Text>
            </View>
            <View style={{ height: "90%", backgroundColor: "rgb(96, 218, 255)" }}>
                <ScrollView style={{ height: "100%", width: "100%", flexGrow: 1 }} bounces={false}>

                    <View style={{ alignItems: "center", position: "relative", top: "2%" }}>
                        <Text style={{ fontSize: "34" }}>{`Item image${(entryData.images.length > 1 ? "s" : "")}`}</Text>
                        {((Object.keys(imagesLoaded).length) < entryData.images.length) &&
                            <View style={styles.yellowPicture}>
                                <Text style={{ textAlign: "center", fontSize: "40" }}>{`Pulling image${(entryData.images.length > 1 ? "s" : "")}`}
                                </Text>
                            </View>}
                        <ScrollView bounces={false} style={{ height: (((Object.keys(imagesLoaded).length) < entryData.images.length) ? "0" : "auto"), display: "flex" }} horizontal showsHorizontalScrollIndicator={false}>
                            {entryData.images.map((picture, index) => (
                                <Pressable key={index}>
                                    <Image onLoad={() => { setImagesLoaded((dict) => ({ ...dict, [index]: true })) }} source={{ uri: picture }} style={styles.picture}></Image>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={{ alignItems: "center", position: "relative", top: "4%" }}>
                        <Text style={{ fontSize: "34" }}>Item description</Text>
                        <Text multiline={true} style={{ height: "auto", width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: "25", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }}>
                            {(entryData.itemDescription.trim() == "" ? "None" : entryData.itemDescription)}
                        </Text>
                    </View>

                    <View style={{ alignItems: "center", position: "relative", top: "6%" }}>
                        <Text style={{ fontSize: "34" }}>Location</Text>
                        <Text multiline={true} style={{ width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: "25", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }}>
                            {entryData.areaLocation}
                        </Text>
                    </View>

                    <View style={{ alignItems: "center", position: "relative", top: "8%" }}>
                        <Text style={{ fontSize: "34" }}>Area description</Text>
                        <Text multiline={true} style={{ height: "auto", width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: "25", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }}>
                            {(entryData.areaDescription.trim() == "" ? "None" : entryData.areaDescription)}
                        </Text>
                    </View>

                    <View style={{ alignItems: "center", position: "relative", top: "10%" }}>
                        <Text style={{ fontSize: "34" }}>Reported by</Text>
                        <Text multiline={false} style={{ width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: "25", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }}>
                            {`${entryData.fName} ${entryData.lName}`}
                        </Text>
                    </View>

                    <View style={{display: (LocalDataManager.userData.foundReports.includes((entryPath+"/"+entryKey) || foundItem) ? "none" : "flex"), alignItems: "center", position: "relative", top: "15%" }}>
                        <Pressable onPress={() => { handleFind() }}>
                            <Text style={{ fontSize: "35", padding: "15", backgroundColor: "rgb(179, 255, 156)", borderColor: "rgb(121, 172, 105)", borderWidth: "2", borderRadius: 25 }}>
                                Report found
                            </Text>
                        </Pressable>
                    </View>

                    <View style={{ alignItems: "center", paddingTop: "75%" }}>
                    </View>

                </ScrollView>
            </View>
            <Pressable style={{ position: "absolute", bottom: "5%", left: "5%", width: "50", height: "50" }}
                onPress={() => { navigation.goBack() }}>
                <Image style={{ width: "50", height: "50" }} source={require("../assets/backIcon.png")}></Image>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    yellowPicture: {
        backgroundColor: "rgb(247, 255, 195)",
        borderColor: "yellow",
        fontSize: "40",
        borderRadius: 10,
        borderWidth: "2",
        alignItems: "center",
        justifyContent: "center",
        width: windowDimensions.width * 0.9,
        height: windowDimensions.width * 0.9,
    },
    picture: {
        backgroundColor: "rgb(128, 225, 255)",
        borderColor: "rgb(74, 179, 211)",
        borderWidth: "2",
        borderRadius: 10,
        width: windowDimensions.width * 0.9,
        height: windowDimensions.width * 0.9,
    }
});