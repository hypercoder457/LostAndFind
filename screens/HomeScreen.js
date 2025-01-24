import React from "react";
import { SafeAreaView, Text, View, Image } from "react-native";
import styles from "../styles";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{ display: "flex", justifyItems: "center", alignItems: "center", height: "auto" }}>
                <Text style={{ fontSize: 50 }}>Lost & Find</Text>
            </View>
            <View style={{ backgroundColor: "rgb(121, 157, 150)", display: "flex", alignItems: "center", justifyItems: "center", borderRadius: 5 }}>
                <View style={styles.mainOptionIcon}>
                    <Image source={require("../assets/searchIcon.png")} style={styles.icon} />
                    <Text style={styles.textWithIcon}>Recover</Text>
                </View>
                <View style={styles.mainOptionIcon}>
                    <Image source={require("../assets/cameraIcon.png")} style={styles.icon} />
                    <Text style={styles.textWithIcon}>Report</Text>
                </View>
                <View style={styles.mainOptionIcon}>
                    <Image source={require("../assets/editIcon.png")} style={styles.icon} />
                    <Text style={styles.textWithIcon}>Edit</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}