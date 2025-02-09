import AsyncStorage from '@react-native-async-storage/async-storage';

// Local User Data Manager
export default class LocalDataManager {
    static dataLoaded = false;
    static userData = {
        firstName: "",
        lastName: "",
        tBNP: "0", // Time Before Next Post
        tBNF: "0", // Time Before Next Find
        foundReports: [],
        userId: "",
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
        if (!this.dataLoaded) {
            console.warn("User data has not loaded and thus can't be updated right now!");
            return;
        }
        if (typeof (key) != "string" || typeof (value) != "string") {
            console.warn("Unable to update user data because key/value is not a string!");
            return;
        }
        if (!key in this.userData) {
            console.warn("Unable to update user data because key is not a valid key entry!");
            return;
        }
        if (typeof(this.userData[key]) == "string") {
            this.userData[key] = value;
        } else if (typeof(this.userData[key]) == "object") {
            this.userData[key].push(value);
        }
    }
    static async saveUserData() {
        if (!this.dataLoaded) {
            console.warn("User data has not been loaded. Unable to save!");
            return;
        }
        try {
            for (let key in this.userData) {
                if (typeof(this.userData[key]) == "string") {
                    await AsyncStorage.setItem(key, this.userData[key]);
                } else if (typeof(this.userData[key]) == "object") {
                    let stringifiedData = "~";
                    const dataLength = this.userData[key].length;
                    for (let i = 0; i < dataLength; i++) {
                        stringifiedData += this.userData[key][i] + (i+1 >= dataLength ? "" : ",");
                    }
                    await AsyncStorage.setItem(key, stringifiedData);
                }
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
                    const valueData = await AsyncStorage.getItem(key);
                    if (valueData !== null) {
                        if (valueData[0] && valueData[0] == "~") {
                            console.log(valueData)
                            let tempValueData = valueData.slice(1, valueData.length);
                            this.userData[key] = tempValueData.split(",");
                        } else {
                            this.userData[key] = valueData;
                        }
                    }
                }
                this.dataLoaded = true;
            } catch (err) {
                console.warn("Failed to load user data! Trying again!");
            }
        }
    }
};