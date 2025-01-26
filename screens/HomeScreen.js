import React from "react";
import { Text, View, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles";

export default function HomeScreen(props) {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{ display: "flex", justifyItems: "center", alignItems: "center", height: "auto" }}>
                <Text style={{ fontSize: 50 }}>Lost & Find</Text>
            </View>
            <View style={{ backgroundColor: "rgb(121, 157, 150)", display: "flex", alignItems: "center", justifyItems: "center", borderRadius: 5 }}>
                <Pressable style={styles.mainOptionIcon} onPress={() => {console.log("Unfinished!")}}>
                    <Image source={require("../assets/searchIcon.png")} style={styles.icon} />
                    <Text style={styles.textWithIcon}>Recover</Text>
                </Pressable>
                <Pressable style={styles.mainOptionIcon} onPress={() => {navigation.replace("Report An Item")}}>
                    <Image source={require("../assets/cameraIcon.png")} style={styles.icon} />
                    <Text style={styles.textWithIcon}>Report</Text>
                </Pressable>
                <Pressable style={styles.mainOptionIcon} onPress={() => {console.log("Unfinished!")}}>
                    <Image source={require("../assets/editIcon.png")} style={styles.icon} />
                    <Text style={styles.textWithIcon}>Edit</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}