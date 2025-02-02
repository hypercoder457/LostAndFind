import React, { use, useRef } from "react";
import Checkbox from 'expo-checkbox';
import { useNavigation } from "@react-navigation/native";
import { Image, Dimensions, ScrollView, TouchableHighlight, View, TextInput, StyleSheet, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { SelectList } from 'react-native-dropdown-select-list';

export default function ItemInfoScreen(info) {
    const entryPath = info.route.params.path;
    const entryKey = info.route.params.key;
    const entryData = info.route.params.data;
    console.log(entryData);
    return (
        <SafeAreaView>
            <Text>This is a very primitive test to show that data from a database can be displayed</Text>
            <Image style={{width: 100, height: 100}} source={{uri: entryData.images[entryData.primaryImageIndex]}}></Image>
            <Text>Item Name: {entryData.itemName}</Text>
            <Text>Location: {entryData.areaLocation}</Text>
        </SafeAreaView>
    );
}