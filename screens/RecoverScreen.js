import React, { use, useRef } from "react";
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
    const navigation = useNavigation();

    const [countyData, setCounty] = React.useState("");
    const [categoryData, setCategory] = React.useState("");
    const [itemDescData, setItemDesc] = React.useState("");
    const [areaDescData, setAreaDesc] = React.useState("");
    
    const [showImportedData, setShowImportedData] = React.useState(null);

    function getPartsFromString(text) {
        const lowerText = text.toLowerCase();
        if (!lowerText.includes(" ")) {
            return([lowerText]);
        }
        const newList = lowerText.split(" ");
        const newListLength = newList.length;
        for (let i = newListLength - 1; i >= 0; i--) {
            if (newList[i] == "") {
                newList.splice(i, 1);
            }
        }
        return(newList);
    }

    function countPoints(mainList, category1, category2) {
        if (mainList != "") {
            let points = 0;
            const reportedParts = [getPartsFromString(category1), getPartsFromString(category2)];
            for (let i = 0; i < 2; i++) {
                const useLength = reportedParts[i].length;
                for (let j = 0; j < useLength; j++) {
                    console.log(mainList)
                    console.log(reportedParts[i][j])
                    if (mainList.includes(reportedParts[i][j])) {
                        points += 1;
                    }
                }
            }
            return(points);
        }
        return(0);
    }

    function filterImportedData() {
        const pointToDataList = [];
        if (itemDescData == "" && areaDescData == "") {
            Object.entries(importedData).forEach(([key, data]) => {
                pointToDataList.push({key: 0, data: [key, data]});
            });
        } else {
            const itemDescParts = getPartsFromString(itemDescData);
            const areaDescParts = getPartsFromString(areaDescData);
            Object.entries(importedData).forEach(([key, data]) => {
                const points = countPoints(itemDescParts, data.itemName, data.itemDescription) + countPoints(areaDescParts, data.areaLocation, data.areaDescription);
                pointToDataList.push({key: points, data: [key, data]});
            });
            pointToDataList.sort((a, b) => b.key - a.key);
        }
        setShowImportedData(pointToDataList);
    }

    async function importNewData() {
        const usePath = `reports/${countyData}/${categoryData}`;
        importedData = await DatabaseManager.getDataSection(usePath);
        if (importedData) {
            filterImportedData();
        } else {
            setShowImportedData(null);
        }
    }

    function hasDataToStartImport() {
        if (countyData == "" || categoryData == "") {
            setShowImportedData(null);
            return(false);
        }

        if (!DatabaseKeys.categories.includes(categoryData)) {
            setShowImportedData(null);
            return(false);
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
            return(false);
        }
        importNewData();
    }

    return (
        <SafeAreaView>
            <Text>County</Text>
            <SelectList
                search={true}
                searchPlaceholder="Can't find the county? Search for it here!"
                notFoundText="That county does not exist!"
                data={DatabaseKeys.counties}
                setSelected={setCounty}
                onSelect={() => {hasDataToStartImport()}}
                save='value'
                dropdownStyles={{ zIndex: 999, position: "absolute", top: 40, marginLegt: 20, marginRight: 20 }}
            />
            <Text>Category</Text>
            <SelectList
                search={false}
                data={DatabaseKeys.categories}
                setSelected={setCategory}
                onSelect={() => {hasDataToStartImport()}}
                save='value'
                dropdownStyles={{ zIndex: 999, position: "absolute", top: 40, marginLegt: 20, marginRight: 20 }}
            />
            <Text>Describe the item</Text>
            <TextInput
                placeholder="PLACE HOLDER"
                value={itemDescData}
                onChangeText={(text) => { setItemDesc(text) }}
                onEndEditing={() => { filterImportedData() }}
            />
            <Text>Describe the area</Text>
            <TextInput
                placeholder="PLACE HOLDER"
                value={areaDescData}
                onChangeText={(text) => { setAreaDesc(text) }}
            />
            <ScrollView style={{height: "100%"}}>
                <Text style={{fontSize: 25, display: (showImportedData ? "none" : "flex")}}>
                    Unable to find anything!
                </Text>
                {showImportedData && showImportedData.map((entry, index) => (
                    <Pressable key={index} onPress={()=> {navigation.replace("Item Info Screen", {key: entry.data[0], data: entry.data[1], path: `reports/${countyData}/${categoryData}`})}}
                     style={{height: 150, width: "100%", backgroundColor: "rgb(125, 125, 125)"}}>
                        <Image style={{width: 100, height: 100}} source={{uri: entry.data[1].images[entry.data[1].primaryImageIndex]}}></Image>
                        <Text>{entry.data[1].itemName}</Text>
                        <Text>{entry.data[1].itemDescription}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}