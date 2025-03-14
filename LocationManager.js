import * as Location from "expo-location";
import { Alert } from "react-native";

export default class LocationManager {
    static hasPermission = false;

    static async checkPermission() {
        const { status } = await Location.getForegroundPermissionsAsync();
        this.hasPermission = (status == "granted");
    }

    static async askForPermission() {
        if (!this.hasPermission) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            console.log(status);
            this.hasPermission = (status == "granted");
        }
    }

    static async getLocation() {
        console.log(this.hasPermission)
        if (this.hasPermission) {
            try {
                const locationCords = await Location.getCurrentPositionAsync();
                const address = await Location.reverseGeocodeAsync(locationCords.coords);
                return (address[0]);
            } catch (err) {
                console.warn("Unable to fetch location!");
                Alert.alert("Error", "This app requires location services to function properly. Please enable location services for this app in your device settings.");
            }
        }
    }
};