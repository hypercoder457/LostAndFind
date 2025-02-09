import React, { use, useState, useRef } from "react";
import Checkbox from 'expo-checkbox';
import { useNavigation } from "@react-navigation/native";
import { Image, Dimensions, ScrollView, TouchableHighlight, View, TextInput, StyleSheet, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { SelectList } from 'react-native-dropdown-select-list';

import DatabaseKeys from "../DatabaseKeys";
import LocalDataManager from "../LocalDataManager";
import DatabaseManager from "../DatabaseManager";

let importedData = null;

export default function RecoverScreen(props) {
    const [ticketSize, setTicketSize] = useState({ width: 0, height: 0 });
    const navigation = useNavigation();

    const [countyData, setCounty] = React.useState("");
    const [categoryData, setCategory] = React.useState("");
    const [itemDescData, setItemDesc] = React.useState("");
    const [areaDescData, setAreaDesc] = React.useState("");

    const [imagesLoaded, setImagesLoaded] = React.useState({});

    const [showImportedData, setShowImportedData] = React.useState(null);

    function getPartsFromString(text) {
        const lowerText = text.toLowerCase();
        if (!lowerText.includes(" ")) {
            return ([lowerText]);
        }
        const newList = lowerText.split(" ");
        const newListLength = newList.length;
        for (let i = newListLength - 1; i >= 0; i--) {
            if (newList[i] == "") {
                newList.splice(i, 1);
            }
        }
        return (newList);
    }

    function countPoints(mainList, category1, category2) {
        if (mainList != "") {
            let points = 0;
            const reportedParts = [getPartsFromString(category1), getPartsFromString(category2)];
            for (let i = 0; i < 2; i++) {
                const useLength = reportedParts[i].length;
                for (let j = 0; j < useLength; j++) {
                    if (mainList.includes(reportedParts[i][j])) {
                        points += 1;
                    }
                }
            }
            return (points);
        }
        return (0);
    }

    function filterImportedData() {
        if (!importedData) {
            return;
        }
        const pointToDataList = [];
        if (itemDescData == "" && areaDescData == "") {
            Object.entries(importedData).forEach(([key, data]) => {
                pointToDataList.push({ key: 0, data: [key, data] });
            });
        } else {
            const itemDescParts = getPartsFromString(itemDescData);
            const areaDescParts = getPartsFromString(areaDescData);
            Object.entries(importedData).forEach(([key, data]) => {
                const points = countPoints(itemDescParts, data.itemName, data.itemDescription) + countPoints(areaDescParts, data.areaLocation, data.areaDescription);
                pointToDataList.push({ key: points, data: [key, data] });
            });
            pointToDataList.sort((a, b) => b.key - a.key);
        }
        setShowImportedData(pointToDataList);
    }

    async function importNewData() {
        const usePath = `reports/${countyData}/${categoryData}`;
        importedData = await DatabaseManager.getDataSection(usePath);

        const currentDate = new Date();
        const currentTime = parseInt(currentDate.getTime());
        for (let reportData in importedData) {
            const experationDate = importedData[reportData].experationDate;
            if (experationDate) {
                if (currentDate > experationDate) {
                    delete importedData[reportData];
                    DatabaseManager.deleteEntry(usePath,"/"+reportData);
                }
            } else {
                delete importedData[reportData];
                DatabaseManager.deleteEntry(usePath,"/"+reportData);
            }
        }

        if (importedData && Object.keys(importedData).length) {
            filterImportedData();
        } else {
            setShowImportedData(null);
        }
    }

    function hasDataToStartImport() {
        if (countyData == "" || categoryData == "") {
            setShowImportedData(null);
            return (false);
        }

        if (!DatabaseKeys.categories.includes(categoryData)) {
            setShowImportedData(null);
            return (false);
        }

        let validCounty = false;
        for (let county of DatabaseKeys.counties) {
            if (county.value == countyData) {
                validCounty = true;
                break;
            }
        }
        if (!validCounty) {
            setShowImportedData(null);
            return (false);
        }
        setImagesLoaded({});
        importNewData();
    }

    return (
        <View>
            <View style={{ height: "10%", width: "100%", backgroundColor: "rgb(0, 175, 229)", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: "40", position: "absolute", bottom: "5%" }}>Recover an item</Text>
            </View>
            <View style={{ height: "90%", backgroundColor: "rgb(96, 218, 255)" }}>
                <ScrollView style={{ height: "100%", width: "100%", flexGrow: 1 }} bounces={false}>
                    <View style={{ alignItems: "center", position: "relative", top: "3%" }}>
                        <Text style={{ fontSize: "34" }}>County</Text>
                        <SelectList
                            search={true}
                            placeholder="Select a county"
                            searchPlaceholder="Search"
                            notFoundText="No results"
                            data={DatabaseKeys.counties}
                            setSelected={setCounty}
                            onSelect={() => { hasDataToStartImport() }}
                            save='value'
                            inputStyles={{ height: "50", fontSize: "25" }}
                            boxStyles={{ height: "50", width: "90%", backgroundColor: "rgb(128, 225, 255)", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }}
                            dropdownTextStyles={{ fontSize: "25" }}
                            dropdownStyles={{ backgroundColor: "rgb(128, 225, 255)", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }}
                        />
                    </View>
                    <View style={{ alignItems: "center", position: "relative", top: "6%" }}>
                        <Text style={{ fontSize: "34" }}>Item category</Text>
                        <SelectList
                            search={false}
                            data={DatabaseKeys.categories}
                            setSelected={setCategory}
                            onSelect={() => { hasDataToStartImport() }}
                            save='value'
                            placeholder="Select an item category"
                            inputStyles={{ height: "50", fontSize: "25" }}
                            boxStyles={{ height: "50", width: "90%", backgroundColor: "rgb(128, 225, 255)", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }}
                            dropdownTextStyles={{ fontSize: "25" }}
                            dropdownStyles={{ backgroundColor: "rgb(128, 225, 255)", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }}
                        />
                    </View>

                    <View style={{ alignItems: "center", position: "relative", top: "9%" }}>
                        <Text style={{ fontSize: "34" }}>Describe the item</Text>
                        <TextInput
                            style={{ height: "50", width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: "25", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }}
                            placeholder="Describe the item"
                            value={itemDescData}
                            onChangeText={(text) => { setItemDesc(text) }}
                            onEndEditing={() => { filterImportedData() }}
                        />
                    </View>

                    <View style={{ alignItems: "center", position: "relative", top: "12%" }}>
                        <Text style={{ fontSize: "34" }}>Describe the area</Text>
                        <TextInput
                            style={{ height: "50", width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: "25", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }}
                            placeholder="Describe the area"
                            value={areaDescData}
                            onChangeText={(text) => { setAreaDesc(text) }}
                        />
                    </View>

                    <View style={{ alignItems: "center", position: "relative", top: "15%" }}>
                        <Text style={{ fontSize: "34" }}>Reports</Text>
                        <View style={{ height: ((Object.keys(imagesLoaded).length) <= 0 ? "50" : "auto"), width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: "25", borderColor: "rgb(74, 179, 211)", borderWidth: "2", textAlign: "center", borderRadius: 10 }} onLayout={(event) => { const { width, height } = event.nativeEvent.layout; setTicketSize({ width: width - 160, height }); }}>
                            {!showImportedData && <Text style={styles.errorText}>No reports</Text>}
                            {(showImportedData && (Object.keys(imagesLoaded).length) <= 0) && <Text style={{ height: "50", backgroundColor: "rgb(247, 255, 195)", borderColor: "yellow", borderRadius: 10, borderWidth: "2", textAlign: "center", fontWeight: 'bold', fontSize: "25" }}>Pulling reports</Text>}
                            {showImportedData && showImportedData.map((entry, index) => (
                                <Pressable style={{ display: "flex", opacity: ((Object.keys(imagesLoaded).length) <= 0 ? 0 : 1), flexDirection: "row", backgroundColor: "rgb(247, 255, 195)", borderColor: "yellow", borderRadius: 10, borderWidth: "2" }} key={index} onPress={() => { navigation.navigate("Item Info Screen", { key: entry.data[0], data: entry.data[1], path: `reports/${countyData}/${categoryData}` }) }}>
                                    <Image onLoad={() => { setImagesLoaded((dict) => ({ ...dict, [index]: true }))}} style={{ width: 150, height: 150 }} source={{ uri: entry.data[1].images[entry.data[1].primaryImageIndex] }}></Image>
                                    {imagesLoaded[index] && <View style={{ position: "relative", width: "50%" }}>
                                        <Text style={{ fontSize: "21", width: ticketSize.width, backgroundColor: "rgb(184, 192, 132))", borderColor: "rgb(144, 150, 103))", borderWidth: "2", textAlign: "center", borderRadius: 10 }}>{entry.data[1].itemName}</Text>
                                        <Text numberOfLines={4} style={{ fontSize: "18", width: ticketSize.width, textAlign: "center" }}>{entry.data[1].itemDescription}</Text>
                                    </View>}
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={{ alignItems: "center", paddingTop: "100%" }}>
                    </View>

                </ScrollView>

                <Pressable style={{ position: "absolute", bottom: "5%", left: "5%", width: "50", height: "50" }}
                    onPress={() => { navigation.goBack() }}>
                    <Image style={{ width: "50", height: "50" }} source={require("../assets/backIcon.png")}></Image>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    errorText: {
        height: "50",
        borderRadius: 10,
        borderColor: "red",
        borderWidth: "2",
        backgroundColor: "rgb(255, 195, 195)",
        textAlign: "center",
        fontSize: "25",
        color: 'red',
        fontWeight: 'bold',
    },
})