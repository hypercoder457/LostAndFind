import React, { useRef } from "react";
import Checkbox from 'expo-checkbox';
import { useNavigation } from "@react-navigation/native";
import { Image, Dimensions, ScrollView, TouchableHighlight, View, TextInput, StyleSheet, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectList } from 'react-native-dropdown-select-list';

import CameraManager from "../CameraManager";
import LocationManager from "../LocationManager";
import DatabaseKeys from "../DatabaseKeys";

const windowDimensions = Dimensions.get('window');

const incompleteTicketTitle = "Ticket Incomplete!";
const minNameLength = 3;
const minLocationLength = 10;

export default function ReportAnItem(props) {
    const navigation = useNavigation();

    // Start of variables
    const [itemNameData, setItemName] = React.useState("");
    const [itemNameColorData, setItemColor] = React.useState("rgb(0, 0, 0)");

    const [itemDescData, setItemDesc] = React.useState("");
    const [areaDescData, setAreaDesc] = React.useState("");
    const [manualAddressData, setManualAddressData] = React.useState("");
    const [MADColor, setMADColor] = React.useState("rgb(0, 0, 0)");

    const [categoryData, setCategory] = React.useState("");
    const [countyData, setCounty] = React.useState("");

    const [imageData, setImageData] = React.useState([]);
    const [primaryImage, setPrimaryImage] = React.useState(-1);
    let imageDisplayer = useRef(null);
    let imageInserter = useRef(null);
    const [imageInserterVisible, setInserterVisibilty] = React.useState(true);

    const [useAuto, setUseAuto] = React.useState(false);
    const [locationAddress, setLocationAddress] = React.useState();
    // End of variables

    function isEmpty(text, minLength) {
        return (!(/[a-zA-Z]/.test(text)) || text.length <= minLength);
    }

    function checkForCompletion() {
        if (isEmpty(itemNameData, minNameLength)) {
            Alert.alert(incompleteTicketTitle, "Please insert a valid item name!");
            return;
        }
        if (categoryData == "") {
            Alert.alert(incompleteTicketTitle, "Please select a category for the item!");
            return;
        }
        if (imageData.length <= 0) {
            Alert.alert(incompleteTicketTitle, "Please insert at least one image!");
            return;
        }
        if (countyData == "") {
            Alert.alert(incompleteTicketTitle, "Please select a county for the item!");
            return;
        }
        if (useAuto) {
            if (!locationAddress) {
                Alert.alert(incompleteTicketTitle, "Unable to use current location because you disabled location permissions for this app!");
                return;
            }
        } else {
            if (isEmpty(manualAddressData, minLocationLength)) {
                Alert.alert(incompleteTicketTitle, "Please insert a valid location!");
                return;
            }
        }
        Alert.alert("End of simulation!", "Your data would go to the database if this was not a simulation!");
        navigation.replace("Home Page");
    }

    function handleImageInserter(useLength) {
        if (useLength >= 2) {
            setInserterVisibilty(false);
        } else {
            setInserterVisibilty(true);
        }
    }

    async function addImagesToPage() {
        if (!CameraManager.hasPermission) {
            await CameraManager.askForPermission();
        }

        if (CameraManager.hasPermission) {
            const photos = await CameraManager.getPhotos();
            if (photos && photos.assets && photos.assets.length > 0) {
                if (imageData.length < 3) {
                    const totalPhotos = photos.assets.length;
                    for (let i = 0; i < totalPhotos; i++) {
                        console.log("Index: " + i);
                        setImageData((oldImageData) => {
                            const updatedImageData = [...oldImageData, photos.assets[i]];
                            handleImageInserter(updatedImageData.length);
                            return (updatedImageData);
                        });
                        if (imageData.length >= 3) {
                            break;
                        }
                    }
                }
            }
        }
        else {
            Alert.alert("Notice!", "To use this feature you need to enable your camera!");
        }
    }

    function removeImegeFromPage(index) {
        const imageDataCopy = [...imageData];
        imageDataCopy.splice(index, 1);
        setImageData(imageDataCopy);
        handleImageInserter(imageData.length - 2);
        setPrimaryImage(primaryImage - 1);
    }

    function makeImagePrimary(index) {
        setPrimaryImage(index);
    }

    async function getCurrentLocation() {
        if (!useAuto) {
            if (!LocationManager.hasPermission) {
                LocationManager.askForPermission();
            }

            if (LocationManager.hasPermission) {
                const results = await LocationManager.getLocation();
                if (results) {
                    setLocationAddress(results);
                    setUseAuto(true);
                }
            }

        } else {
            setUseAuto(false);
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <Text>Name</Text>
                <TextInput
                    placeholder="Item Name"
                    value={itemNameData}
                    onChangeText={(text) => {
                        setItemName(text);
                        setItemColor("rgb(0, 0, 0)");
                    }}
                    onBlur={() => { (isEmpty(itemNameData, minNameLength) ? setItemColor("rgb(255, 0, 0)") : setItemColor("rgb(0, 255, 0)")) }}
                    style={{ color: itemNameColorData }}
                />

                <Text>Category</Text>
                <SelectList
                    search={false}
                    data={DatabaseKeys.categories}
                    setSelected={setCategory}
                    save='value'
                    dropdownStyles={{ zIndex: 999, position: "absolute", top: 40, marginLegt: 20, marginRight: 20 }}
                />

                <Text>Images</Text>
                <ScrollView ref={imageDisplayer} style={{ display: "flex", backgroundColor: "rgb(255, 0, 0)" }} horizontal>
                    {imageData.map((picture, index) => (
                        <Pressable key={index}>
                            <Image source={{ uri: picture.uri }} style={styles.picture}></Image>
                            <Pressable onPress={() => { removeImegeFromPage(index) }}>
                                <Text style={styles.pictureRemove}>Remove</Text>
                            </Pressable>
                            <Pressable onPress={() => { makeImagePrimary(index) }}>
                                <Image source={(index == primaryImage ? require("../assets/starIcon.png") : require("../assets/unStarIcon.png"))} style={styles.picturePrimary}></Image>
                            </Pressable>
                            <Text style={styles.pictureNumber}>{index + 1}/3</Text>
                        </Pressable>
                    ))}
                    <Pressable ref={imageInserter} style={{ backgroundColor: "rgb(0, 255, 47)", display: (imageInserterVisible ? "flex" : "none") }} onPress={() => { addImagesToPage() }}>
                        <Image source={require("../assets/plusIcon.png")} style={styles.picture} />
                    </Pressable>
                </ScrollView>

                <Text>Description</Text>
                <TextInput
                    placeholder="Description"
                    value={itemDescData}
                    onChangeText={(text) => { setItemDesc(text) }}
                />

                <Text>County</Text>
                <SelectList
                    search={true}
                    searchPlaceholder="Can't find the county? Search for it here!"
                    notFoundText="That county does not exist!"
                    data={DatabaseKeys.counties}
                    setSelected={setCounty}
                    save='value'
                    dropdownStyles={{ zIndex: 999, position: "absolute", top: 40, marginLegt: 20, marginRight: 20 }}
                />

                <Text>Area Description</Text>
                <TextInput
                    placeholder="Area Description"
                    value={areaDescData}
                    onChangeText={(text) => { setAreaDesc(text) }}
                />

                <Text>Location</Text>
                <View>
                    <Text>Use current location</Text>
                    <Checkbox value={useAuto} onValueChange={() => { getCurrentLocation() }} />
                    <View style={{ display: (useAuto ? "none" : "flex") }}>
                        <Text>Input location manually</Text>
                        <TextInput
                            placeholder="Location"
                            value={manualAddressData}
                            onChangeText={(text) => { setManualAddressData(text) }}
                            onBlur={() => { (isEmpty(manualAddressData, minLocationLength) ? setMADColor("rgb(255, 0, 0)") : setMADColor("rgb(0, 255, 0)")) }}
                            style={{ color: MADColor }}
                        />
                    </View>
                </View>

                <TouchableHighlight onPress={() => { checkForCompletion() }}>
                    <Text style={{ backgroundColor: "rgb(125, 125, 125)", height: 100 }}>
                        Submit report
                    </Text>
                </TouchableHighlight>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    picture: {
        width: windowDimensions.width * 0.9,
        height: windowDimensions.width * 0.9
    },
    pictureNumber: {
        borderWidth: 1,
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255, 0, 0)",
        padding: 5,
        fontSize: 15,
        position: "absolute",
        left: windowDimensions.width * 0.8,
        bottom: windowDimensions.width * 0.05,
    },
    pictureRemove: {
        borderWidth: 1,
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255, 0, 0)",
        padding: 5,
        fontSize: 15,
        position: "absolute",
        left: windowDimensions.width * 0.05,
        bottom: windowDimensions.width * 0.05,
    },
    picturePrimary: {
        position: "absolute",
        left: windowDimensions.width * 0.65,
        bottom: windowDimensions.width * 0.65,
        width: 75,
        height: 75,
    }
})