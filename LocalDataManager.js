import AsyncStorage from '@react-native-async-storage/async-storage';

// Local User Data Manager
export default class LocalDataManager {
    static dataLoaded = false;
    static userData = {
        firstName: "",
        lastName: "",
        tBNP: "0", // Time Before Next Post
    };
    static async waitUntilUserDataLoaded() {
        return new Promise((finished) => {
            const intervalId = setInterval(() => {
                if (this.dataLoaded) {
                    if (this.userData.firstName == "" || this.userData.lastName == "") {
                        clearInterval(intervalId);
                        finished(false);
                    } else {
                        clearInterval(intervalId);
                        finished(true);
                    }
                }
            }, 10);
        });
    }
    static updateUserData(key, value) {
        if (typeof (key) != "string" || typeof (value) != "string") {
            console.warn("Unable to update user data because key/value is not a string!");
            return;
        }
        if (!key in this.userData) {
            console.warn("Unable to update user data because key is not a valid key entry!");
            return;
        }
        this.userData[key] = value;
        this.dataLoaded = true;
    }
    static async saveUserData() {
        if (!this.dataLoaded) {
            console.warn("User data has not been loaded. Unable to save!");
            return;
        }
        try {
            for (let key in this.userData) {
                await AsyncStorage.setItem(toString(key), this.userData[key]);
            }
        } catch (err) {
            console.warn("Unable to save user data! Error:" + err);
        }
    }
    static async loadUserData() {
        if (this.dataLoaded) {
            console.warn("User data has already been loaded. Unable to load!");
            return;
        }
        while (!this.dataLoaded) {
            try {
                for (let key in this.userData) {
                    const valueData = await AsyncStorage.getItem(toString(key));
                    if (valueData !== null) {
                        this.userData[key] = valueData;
                    }
                }
                this.dataLoaded = true;
            } catch (err) {
                console.warn("Failed to load user data! Trying again!");
            }
        }
    }
};