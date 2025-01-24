import React from "react";
import { useNavigation } from "@react-navigation/native";
import Login from "./Login";
import { SafeAreaView, Text } from "react-native";

export default function RegisterAccountScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <Text>Please Log In!</Text>
            <Login nav={navigation} />
        </SafeAreaView>
    );
}