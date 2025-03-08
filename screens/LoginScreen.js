import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { Button, TextInput, StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from 'expo-checkbox';

import LocalDataManager from "../LocalDataManager";
import DatabaseManager from "../DatabaseManager";

export default function Login(props) {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [agreeded, setAgreeded] = useState(false);
    const [clickedSubmit, setClickedSubmit] = useState(false);
    const navigation = useNavigation();
    const scrollViewRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const TOSRef = useRef();

    const onError = data => {
        setClickedSubmit(true);
        if (data.firstname) {
            scrollToView(firstNameRef);
        } else if (data.lastname) {
            scrollToView(lastNameRef);
        }
    };

    const onSubmit = data => {
        setClickedSubmit(true);
        if (!agreeded) {
            return;
        }
        LocalDataManager.updateUserData("firstName", data.firstname);
        LocalDataManager.updateUserData("lastName", data.lastname);
        LocalDataManager.saveUserData();
        DatabaseManager.generateUserKey(LocalDataManager);
        navigation.replace("Home Page");
    };

    function scrollToView(target) {
        target.current.measureLayout(
            scrollViewRef.current,
            (x, y, width, height) => {
                scrollViewRef.current.scrollTo({ y: y - 50, animated: true });
            },
        );
    }

    return (
        <View>
            <SafeAreaView style={{ height: "12.5%", width: "100%", backgroundColor: "rgb(0, 175, 229)", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 40, position: "absolute", bottom: "5%" }} accessible={true} accessibilityRole="text">Make an Account</Text>
            </SafeAreaView>
            <View style={{ height: "90%", backgroundColor: "rgb(96, 218, 255)" }}>
                <ScrollView ref={scrollViewRef} style={{ height: "200%", width: "100%" }} bounces={false}>
                    <View ref={firstNameRef} style={{ alignItems: "center", position: "relative", top: "5%" }}>
                        <Text style={{ fontSize: 34 }} accessible={true} accessibilityRole="text">First name</Text>
                        <Controller
                            control={control}
                            name="firstname"
                            rules={{ required: "First name is required", minLength: { value: 3, message: "First name must be within 3-25 characters long" }, maxLength: { value: 25, message: "First name must be within 3-25 characters long" }, pattern: { value: /^[A-Za-z]+$/, message: "Only letters a-Z are allowed" } }}
                            render={({ field: { onChange, onBlur, value } }) => <TextInput placeholderTextColor={"rgb(33, 100, 120)"} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="First Name"
                                style={{ height: "50", width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: 25, borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10 }} accessible={true} />}
                        />
                        {errors.firstname && <Text style={styles.errorText} accessible={true} accessibilityRole="text">{errors.firstname.message}</Text>}
                    </View>
                    <View ref={lastNameRef} style={{ alignItems: "center", position: "relative", top: "10%" }}>
                        <Text style={{ fontSize: 34 }} accessible={true} accessibilityRole="text">Last name</Text>
                        <Controller
                            control={control}
                            name="lastname"
                            rules={{ required: "Last name is required", minLength: { value: 3, message: "Last name must be within 3-25 characters long" }, maxLength: { value: 25, message: "Last name must be within 3-25 characters long" }, pattern: { value: /^[A-Za-z]+$/, message: "Only letters a-Z are allowed" } }}
                            render={({ field: { onChange, onBlur, value } }) => <TextInput placeholderTextColor={"rgb(33, 100, 120)"} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="Last Name"
                                style={{ height: "50", width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: 25, borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10 }} accessible={true} />}
                        />
                        {errors.lastname && <Text style={styles.errorText} accessible={true} accessibilityRole="text">{errors.lastname.message}</Text>}
                    </View>
                    <View style={{ width: "95%", marginLeft: "2.5%", alignItems: "center", position: "relative", top: "15%" }}>
                        <Text style={{ fontSize: 34 }} accessible={true} accessibilityRole="text">Terms of service</Text>
                        <View style={{ backgroundColor: "rgb(128, 225, 255)", borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10 }}>
                            <Text style={styles.TOSRule} accessible={true} accessibilityRole="text">1. I will not post personal information on this app</Text>
                            <Text style={styles.TOSRule} accessible={true} accessibilityRole="text">2. I will only use this app to find my lost items or report lost items</Text>
                            <Text style={styles.TOSRule} accessible={true} accessibilityRole="text">3. I will not spread hate or misinformation</Text>
                        </View>
                    </View>
                    <View ref={TOSRef} style={{ alignSelf: "center", alignItems: "center", position: "relative", top: "20%" }}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <Checkbox style={{ width: "25", height: "25", marginRight: "25" }} value={agreeded} onValueChange={() => { setAgreeded(!agreeded) }} accessible={true} accessibilityRole="checkbox" />
                            <Text style={{ fontSize: 16 }} accessible={true} accessibilityRole="text">I agree to the Terms of Service</Text>
                        </View>
                        {(clickedSubmit && !agreeded) && <Text style={styles.errorText} accessible={true} accessibilityRole="text">You must agree to the Terms of Service to use this app</Text>}
                    </View>
                    <Pressable style={{ alignSelf: "center", marginTop: "60%" }} onPress={handleSubmit(onSubmit, onError)}>
                        <Text style={{
                            fontSize: 35, padding: "15", backgroundColor: "rgb(0, 175, 229)",
                            borderColor: "rgb(0, 129, 168)", borderWidth: 2, borderRadius: 25
                        }} accessible={true}
                            accessibilityRole="button">Create account</Text>
                    </Pressable>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    TOSRule: {
        fontSize: 21,
        textAlign: "center"
    },
    errorText: {
        borderRadius: 10,
        borderColor: "red",
        borderWidth: 2,
        backgroundColor: "rgb(255, 195, 195)",
        textAlign: "center",
        fontSize: 25,
        color: 'red',
        fontWeight: 'bold',
    },
})