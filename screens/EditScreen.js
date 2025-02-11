import React, { use, useState, useEffect, useRef } from "react";
import Checkbox from 'expo-checkbox';
import { useNavigation } from "@react-navigation/native";
import { Image, Dimensions, ScrollView, TouchableHighlight, View, TextInput, StyleSheet, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { SelectList } from 'react-native-dropdown-select-list';

import DatabaseKeys from "../DatabaseKeys";
import LocalDataManager from "../LocalDataManager";
import DatabaseManager from "../DatabaseManager";

export default function EditScreen(props) {
    const [ticketSize, setTicketSize] = useState({ width: 0, height: 0 });
    const navigation = useNavigation();

    const [imagesLoaded, setImagesLoaded] = React.useState({});
    const [showImportedData, setShowImportedData] = React.useState(null);

    useEffect(() => {
        async function getUserRepors() {

            if (LocalDataManager.dataLoaded && "userId" in LocalDataManager.userData) {

                const results = await DatabaseManager.getDataSection(`users/${LocalDataManager.userData.userId}/reports`);
                if (results) {
                    const currentDate = new Date();
                    const currentTime = parseInt(currentDate.getTime());
                    const useImportedData = [];
                    for (let reportKey in results) {
                        const reportData = await DatabaseManager.getDataSection(results[reportKey]);
                        if (reportData) {
                            const experationDate = reportData.experationDate;
                            if (experationDate) {
                                if (currentTime > parseInt(experationDate)) {
                                    await DatabaseManager.deleteEntry(("reports/" + reportData.county + "/" + reportData.category), results[reportKey]);
                                } else {
                                    useImportedData.push({ key: results[reportKey], data: reportData, reportKey: reportKey });
                                }
                            } else {
                                await DatabaseManager.deleteEntry(("reports/" + reportData.county + "/" + reportData.category), results[reportKey]);
                            }
                        }
                    }
                    setShowImportedData(useImportedData);
                } else {
                    setShowImportedData(false);
                }
            }
        }
        getUserRepors();
    }, []);

    return (
        <View>
            <View style={{ height: "10%", width: "100%", backgroundColor: "rgb(0, 175, 229)", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 40, position: "absolute", bottom: "5%" }}>Edit a Report</Text>
            </View>
            <View style={{ height: "90%", backgroundColor: "rgb(96, 218, 255)", alignItems: "center" }}>
                <ScrollView style={{ height: "100%", width: "90%", flexGrow: 1 }} bounces={false} onLayout={(event) => { const { width, height } = event.nativeEvent.layout; setTicketSize({ width: width - 160, height }); }}>
                    <Text style={{ fontSize: 34, textAlign: "center", marginTop: "25" }}>Reports</Text>
                    {!showImportedData && showImportedData !== false && <View style={{ flexDirection: "row", height: 150, backgroundColor: "rgb(247, 255, 195)", borderColor: "yellow", borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" }}><Text style={{ textAlign: "center", fontSize: 25, fontWeight: 'bold' }}>Checking User Data</Text></View>}
                    {showImportedData && (Object.keys(imagesLoaded).length) <= 0 && <View style={{ flexDirection: "row", height: 150, backgroundColor: "rgb(247, 255, 195)", borderColor: "yellow", borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" }}><Text style={{ textAlign: "center", fontSize: 25, fontWeight: 'bold' }}>Pulling Reports</Text></View>}
                    {showImportedData === false && <View style={{ flexDirection: "row", height: 150, backgroundColor: "rgb(255, 195, 195)", borderColor: "red", borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" }}><Text style={{ textAlign: "center", fontSize: 25, fontWeight: 'bold' }}>You have not reported any missing items</Text></View>}
                    {showImportedData && showImportedData.length > 0 && (
                        showImportedData.map((report, index) => (
                            <Pressable style={{ display: "flex", opacity: ((Object.keys(imagesLoaded).length) <= 0 ? 0 : 1), flexDirection: "row", backgroundColor: "rgb(247, 255, 195)", borderColor: "yellow", borderRadius: 10, borderWidth: 2 }} key={index} onPress={() => { navigation.navigate("Report An Item", { key: report.key, data: report.data, reportPath: report.reportKey, path: `reports/${report.data.county}/${report.data.category}` }) }}>
                                <Image onLoad={() => { setImagesLoaded((dict) => ({ ...dict, [index]: true })) }} style={{ width: 150, height: 150, borderRadius: 10 }} source={{ uri: report.data.images[report.data.primaryImageIndex] }}></Image>
                                {imagesLoaded[index] && <View style={{ position: "relative", width: "50%" }}>
                                    <Text style={{ fontSize: 21, width: ticketSize.width, backgroundColor: "rgb(184, 192, 132))", borderColor: "rgb(144, 150, 103))", borderWidth: 2, textAlign: "center", borderRadius: 10 }}>{report.data.itemName}</Text>
                                    <Text numberOfLines={4} style={{ fontSize: 18, width: ticketSize.width, textAlign: "center" }}>{(report.data.itemDescription == "" ? "No description" : report.data.itemDescription)}</Text>
                                </View>}
                            </Pressable>
                        ))
                    )}
                    <View style={{ paddingTop: "100" }}></View>
                </ScrollView>
            </View>
            <Pressable style={{ position: "absolute", bottom: "5%", left: "5%", width: "50", height: "50" }}
                onPress={() => { navigation.goBack() }}>
                <Image style={{ width: "50", height: "50" }} source={require("../assets/backIcon.png")}></Image>
            </Pressable>
        </View>
    );
}

