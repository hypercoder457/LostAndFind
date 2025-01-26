import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { Button, TextInput, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LocalDataManager from "../LocalDataManager";

export default function Login(props) {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [submittedData, setSubmittedData] = useState('');
    const navigation = useNavigation();
    const onSubmit = data => {
        // Simulate form submission
        console.log('Submitted Data:', data);
        setSubmittedData(data);
        LocalDataManager.updateUserData("firstName", data.firstname);
        LocalDataManager.updateUserData("lastName", data.lastname);
        LocalDataManager.saveUserData();
        navigation.replace("Home Page"); // Use replace to ensure they can't go back to the loading screen!
        console.log("Navigated to Main Page");
    };
    return ( // Use SafeAreaView to ensure the GUI fits on the screen!
        <SafeAreaView>
            <Controller
                control={control}
                name="firstname"
                rules={{ required: "First name is required" }}
                render={({ field: { onChange, onBlur, value } }) => <TextInput onBlur={onBlur} onChangeText={onChange} value={value} placeholder="First Name" />}
            />
            {errors.firstname && <Text style={styles.errorText}>{errors.firstname.message}</Text>}
            <Controller
                control={control}
                name="lastname"
                rules={{ required: "Last name is required" }}
                render={({ field: { onChange, onBlur, value } }) => <TextInput onBlur={onBlur} onChangeText={onChange} value={value} placeholder="Last Name" />}
            />
            {errors.lastname && <Text style={styles.errorText}>{errors.lastname.message}</Text>}
            <Button title="Login" onPress={handleSubmit(onSubmit)} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    errorText: {
        color: 'black',
        fontWeight: 'bold',
    },
})