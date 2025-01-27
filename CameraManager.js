import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

export default class CameraManager {
    static hasPermission = false;
    static maxPhotos = 3;

    static async checkPermission() {
        const { status } = await MediaLibrary.getPermissionsAsync();
        this.hasPermission = (status == "granted");
    }

    static async askForPermission() {
        if (!this.hasPermission) {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            this.hasPermission = (status == "granted");
        }
    }

    static async getPhotos() {
        if (this.hasPermission) {
            const results = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsMultipleSelection: true,
                selectionLimit: this.maxPhotos,
            });

            if (!results.canceled) {
                return (results);
            }
        }
    }
};