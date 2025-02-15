import React, { useRef, useEffect } from "react";
import Checkbox from 'expo-checkbox';
import { useNavigation } from "@react-navigation/native";
import { Image, Dimensions, ScrollView, TouchableHighlight, View, TextInput, StyleSheet, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { SelectList } from 'react-native-dropdown-select-list';

import CameraManager from "../CameraManager";
import LocationManager from "../LocationManager";
import DatabaseKeys from "../DatabaseKeys";
import LocalDataManager from "../LocalDataManager";
import DatabaseManager from "../DatabaseManager";

const windowDimensions = Dimensions.get('window');

const incompleteTicketTitle = "Ticket incomplete";
const minNameLength = 3;
const maxNameLength = 30;
const minLocationLength = 10;
const maxLocationLength = 125;
const maxItemDescriptionLength = 125;
const maxAreaDescriptionLength = 125;

export default function ReportAnItem(info) {
    const navigation = useNavigation();
    const scrollViewRef = useRef();
    const itemNameRef = useRef();
    const itemCategoryRef = useRef();
    const imagesRef = useRef();
    const itemDescriptionRef = useRef();
    const countyRef = useRef();
    const areaDescriptionRef = useRef();
    const locationRef = useRef();

    // Start of variables
    const [clickedSubmit, setClickedSubmit] = React.useState(false);
    const [reportingTicket, setReportingTicket] = React.useState(false);

    const [itemNameData, setItemName] = React.useState("");
    const [itemNameViolates, setItemNameViolates] = React.useState(0);

    const [itemDescData, setItemDesc] = React.useState("");
    const [areaDescData, setAreaDesc] = React.useState("");

    const [manualAddressData, setManualAddressData] = React.useState("");
    const [MADViolates, setMADViolates] = React.useState(0);

    const [categoryData, setCategory] = React.useState("");
    const [countyData, setCounty] = React.useState("");

    const [imageData, setImageData] = React.useState([]);
    const [primaryImage, setPrimaryImage] = React.useState(0);
    let imageDisplayer = useRef(null);
    let imageInserter = useRef(null);
    const [imageInserterVisible, setInserterVisibilty] = React.useState(true);

    const [useAuto, setUseAuto] = React.useState(false);
    const [locationAddress, setLocationAddress] = React.useState();
    // End of variables

    const editEntryPath = (info.route.params ? info.route.params.path : null);
    const editEntryKey = (info.route.params ? info.route.params.key : null);
    const editEntryData = (info.route.params ? info.route.params.data : null);
    const editEntryReportKey = (info.route.params ? info.route.params.reportPath : null);

    useEffect(() => {
        if (editEntryData) {
            setItemName(editEntryData.itemName);
            setCategory(editEntryData.category);
            const processedImages = [];
            for (let image of editEntryData.images) {
                processedImages.push({ uri: image });
            }
            setImageData(processedImages);
            setPrimaryImage(editEntryData.primaryImageIndex);
            setItemDesc(editEntryData.itemDescription);
            setCounty(editEntryData.county);
            setAreaDesc(editEntryData.areaDescription);
            setManualAddressData(editEntryData.areaLocation);
            async function entryStillExists() {
                let results = await DatabaseManager.hasEntry(editEntryKey);
                if (!results) {
                    Alert.alert("Notice", "This entry no longer exists!");
                    navigation.replace("Edit Screen");
                }
            }
            entryStillExists();
        }
    }, []);

    function isEmpty(text, minLength) {
        return (!(/[a-zA-Z]/.test(text)) || text.length <= minLength);
    }

    function scrollToView(target) {
        target.current.measureLayout(
            scrollViewRef.current,
            (x, y, width, height) => {
                scrollViewRef.current.scrollTo({ y: y - 50, animated: true });
            },
        );
    }

    async function checkForCompletion() {
        setClickedSubmit(true);
        const check1 = isEmpty(itemNameData, minNameLength);
        const check2 = itemNameData > maxNameLength;
        const check3 = isEmpty(manualAddressData, minLocationLength);
        const check4 = manualAddressData.length > maxLocationLength;
        if (check1) {
            setItemNameViolates(1);
        }
        if (check2) {
            setItemNameViolates(2);
        }
        if (check3) {
            setMADViolates(1);
        }
        if (check4) {
            setMADViolates(2);
        }

        if (check1 || check2) {
            console.log("Con1");
            scrollToView(itemNameRef);
            return;
        }
        if (categoryData == "") {
            console.log("Con2");
            scrollToView(itemCategoryRef);
            return;
        }
        if (imageData.length <= 0) {
            console.log("Con3");
            scrollToView(imagesRef);
            return;
        }
        if (itemDescData.length > maxItemDescriptionLength) {
            console.log("Con4");
            scrollToView(itemDescriptionRef);
            return;
        }
        if (countyData == "") {
            console.log("Con5");
            scrollToView(countyRef);
            return;
        }
        if (areaDescData.length > maxAreaDescriptionLength) {
            console.log("Con6");
            scrollToView(areaDescriptionRef);
            return;
        }
        if (useAuto) {
            if (!locationAddress) {
                console.log("Con7");
                scrollToView(locationRef);
                return;
            }
        } else {
            if (check3 || check4) {
                console.log("Con8");
                scrollToView(locationRef);
                return;
            }
        }

        let locationData = manualAddressData;
        if (useAuto) {
            locationData = locationAddress.name + " " + locationAddress.district + " " + locationAddress.city + " " + locationAddress.postalCode;
        }

        const useImageData = [];
        const totalImages = imageData.length;
        let missingImage = false;
        for (let i = totalImages - 1; i >= 0; i--) {
            if (!(imageData[i].uri.includes("https://firebasestorage.googleapis.com"))) {
                const pictureInfo = await FileSystem.getInfoAsync(imageData[i].uri);
                if (pictureInfo.exists) {
                    useImageData.push(imageData[i].uri);
                } else {
                    removeImegeFromPage(i);
                    missingImage = true;
                };
            } else {
                useImageData.push(imageData[i].uri);
            }
        }
        if (missingImage) {
            Alert.alert("Missing File(s)", "Unable to submit because one or more of your images was deleted!");
            scrollToView(imagesRef);
            console.log("Con9");
            return;
        }


        const currentDate = new Date();
        if (LocalDataManager.dataLoaded) {
            const useTBN = (editEntryPath ? "tBNE" : "tBNP");
            if (useTBN in LocalDataManager.userData) {
                if (useTBN == "tBNE") {
                    const currentTime = parseInt(currentDate.getTime());
                    const tBNE = parseInt(LocalDataManager.userData.tBNE);
                    if (tBNE > currentTime) {
                        const secondsLeft = Math.ceil((tBNE - currentTime) * 0.001);
                        Alert.alert("Notice", "You can save your changes in " + secondsLeft + " seconds!");
                        return;
                    }
                }

                const futureTime = parseInt(currentDate.getTime()) + 30000;
                const stringFutureTime = futureTime.toString();
                LocalDataManager.updateUserData(useTBN, stringFutureTime);
                LocalDataManager.saveUserData();
            } else {
                Alert.alert("Malformed Data", "Unable to submit ticket because your local data is malformed!");
                console.log("Con10");
                return;
            }
        } else {
            Alert.alert("Error", "Your local data has not loaded yet!");
            console.log("Con11");
            return;
        }

        setReportingTicket(true);

        const experationDate = parseInt(currentDate.getTime()) + 2419200000;
        const reportEntry = {
            fName: LocalDataManager.userData.firstName,
            lName: LocalDataManager.userData.lastName,
            userId: LocalDataManager.userData.userId,

            county: countyData,
            category: categoryData,

            itemName: itemNameData,
            itemDescription: itemDescData,

            areaDescription: areaDescData,
            areaLocation: locationData,

            primaryImageIndex: primaryImage,
            images: useImageData,

            experationDate: experationDate,
        };

        const results = await DatabaseManager.makeReport(reportEntry);
        if (results) {
            if (editEntryPath) {
                await DatabaseManager.deleteEntry(editEntryPath, editEntryKey);
                const userPath = "users/" + editEntryData.userId;
                await DatabaseManager.deleteEntry(userPath, (userPath + "/reports/" + editEntryReportKey));
                navigation.replace("Edit Screen");
            } else {
                navigation.replace("Home Page");
            }
        } else {
            setReportingTicket(false);
            Alert.alert("Error", "Unable to submit ticket! Please try again!");
            return;
        }
    }

    function handleImageInserter(useLength) {
        if (useLength >= 3) {
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
        if (primaryImage > 0) {
            setPrimaryImage(primaryImage - 1);
        }
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
        <View>
            <View style={{ height: "10%", width: "100%", backgroundColor: "rgb(0, 175, 229)", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 40, position: "absolute", bottom: "5%" }}>{(!editEntryData ? "Report an Item" : "Edit a Report")}</Text>
            </View>
            <View style={{ height: "90%", backgroundColor: "rgb(96, 218, 255)" }}>
                <ScrollView ref={scrollViewRef} style={{ height: "100%", width: "100%", flexGrow: 1 }} bounces={false}>
                    <View style={{ alignItems: "center", position: "relative", top: "1.5%" }}>
                        <Text style={{ fontSize: 34 }}>Item Name</Text>
                        <TextInput ref={itemNameRef}
                            placeholder="Item Name"
                            value={itemNameData}
                            onChangeText={(text) => {
                                setItemName(text);
                            }}
                            onBlur={() => { (isEmpty(itemNameData, minNameLength) ? setItemNameViolates(1) : (itemNameData.length > maxNameLength ? setItemNameViolates(2) : setItemNameViolates(0))) }}
                            style={{ height: "50", width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: 25, borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10 }}
                        />
                        {itemNameViolates !== 0 && <Text style={styles.errorText}>{(itemNameViolates == 1 ? "Item name is too short" : "Item name is too long")}</Text>}
                    </View>

                    <View ref={itemCategoryRef} style={{ alignItems: "center", position: "relative", top: "3%" }}>
                        <Text style={{ fontSize: 34 }}>Item Category</Text>
                        <SelectList
                            search={false}
                            data={DatabaseKeys.categories}
                            setSelected={setCategory}
                            defaultOption={categoryData ? { key: categoryData, value: categoryData } : undefined}
                            save='value'
                            placeholder="Select an item category"
                            inputStyles={{ height: "50", fontSize: 25 }}
                            boxStyles={{ height: "50", width: "90%", backgroundColor: "rgb(128, 225, 255)", borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10 }}
                            dropdownTextStyles={{ fontSize: 25 }}
                            dropdownStyles={{ backgroundColor: "rgb(128, 225, 255)", borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10 }}
                        />
                        {(clickedSubmit && !categoryData) && <Text style={styles.errorText}>Category can not be blank</Text>}
                    </View>

                    <View ref={imagesRef} style={{ alignItems: "center", position: "relative", top: "4.5%" }}>
                        <Text style={{ fontSize: 34 }}>{`Item Image${(imageData.length > 1 ? "s" : "")}`}</Text>
                        <ScrollView bounces={false} ref={imageDisplayer} style={{ display: "flex" }} horizontal showsHorizontalScrollIndicator={false}>
                            {imageData.map((picture, index) => (
                                <Pressable key={index}>
                                    <Image source={{ uri: picture.uri }} style={styles.picture}></Image>
                                    <Pressable onPress={() => { removeImegeFromPage(index) }}>
                                        <Text style={styles.pictureRemove}>Remove</Text>
                                    </Pressable>
                                    <Pressable onPress={() => { makeImagePrimary(index) }}>
                                        <Text style={styles.primaryButton}>{((index == primaryImage) ? "Primary Image" : "Make Primary")}</Text>
                                    </Pressable>
                                    <Text style={styles.pictureNumber}>{index + 1}/3</Text>
                                </Pressable>
                            ))}
                            <Pressable ref={imageInserter} style={{ display: (imageInserterVisible ? "flex" : "none"), width: windowDimensions.width * 0.9, height: windowDimensions.width * 0.9, backgroundColor: "red" }} onPress={() => { addImagesToPage() }}>
                                <Image source={require("../assets/plusIcon.png")} style={styles.pictureAdd} />
                            </Pressable>
                        </ScrollView>
                        {(clickedSubmit && imageData.length <= 0) && <Text style={styles.errorText}>You must have at least one image</Text>}
                    </View>

                    <View ref={itemDescriptionRef} style={{ alignItems: "center", position: "relative", top: "6%" }}>
                        <Text style={{ fontSize: 34 }}>Item Description</Text>
                        <TextInput
                            multiline={true}
                            style={{ height: "100", width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: 25, borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10 }}
                            placeholder="Item Description"
                            value={itemDescData}
                            onChangeText={(text) => { setItemDesc(text) }}
                        />
                        {itemDescData.length > maxItemDescriptionLength && <Text style={styles.errorText}>Item description is too long</Text>}
                    </View>

                    <View ref={countyRef} style={{ alignItems: "center", position: "relative", top: "7.5%" }}>
                        <Text style={{ fontSize: 34 }}>County</Text>
                        <SelectList
                            data={DatabaseKeys.counties}
                            search={true}
                            searchPlaceholder="Search"
                            notFoundText="No results"
                            setSelected={setCounty}
                            defaultOption={countyData ? { key: countyData, value: countyData } : undefined}
                            save='value'
                            placeholder="Select a county"
                            inputStyles={{ height: "50", fontSize: 25 }}
                            boxStyles={{ height: "50", width: "90%", backgroundColor: "rgb(128, 225, 255)", borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10 }}
                            dropdownTextStyles={{ fontSize: 25 }}
                            dropdownStyles={{ backgroundColor: "rgb(128, 225, 255)", borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10 }}
                        />
                        {(clickedSubmit && !countyData) && <Text style={styles.errorText}>Category can not be blank</Text>}
                    </View>

                    <View ref={areaDescriptionRef} style={{ alignItems: "center", position: "relative", top: "9%" }}>
                        <Text style={{ fontSize: 34 }}>Area Description</Text>
                        <TextInput
                            multiline={true}
                            style={{ height: "100", width: "90%", backgroundColor: "rgb(128, 225, 255)", fontSize: 25, borderColor: "rgb(74, 179, 211)", borderWidth: 2, textAlign: "center", borderRadius: 10 }}
                            placeholder="Area Description"
                            value={areaDescData}
                            onChangeText={(text) => { setAreaDesc(text) }}
                        />
                        {areaDescData.length > maxAreaDescriptionLength && <Text style={styles.errorText}>Area description is too long</Text>}
                    </View>

                    <View ref={locationRef} style={{ alignItems: "center", position: "relative", top: "10.5%" }}>
                        <Text style={{ fontSize: 32, textAlign: "center" }}>Location</Text>
                        <View style={{ height: (useAuto ? "50" : "100"), width: "90%", backgroundColor: "rgb(128, 225, 255)", borderColor: "rgb(74, 179, 211)", borderWidth: 2, borderRadius: 10 }}>
                            <View style={{ paddingTop: "5", display: "flex", flexDirection: "row", alignSelf: "center", alignItems: "center" }}>
                                <Checkbox style={{ width: 35, height: 35 }} value={useAuto} onValueChange={() => { getCurrentLocation() }} />
                                <Text style={{ marginLeft: "5", fontSize: 25 }}>Use current location</Text>
                            </View>

                            <View style={{ marginTop: "10", display: (useAuto ? "none" : "flex") }}>
                                <TextInput
                                    placeholder="Location"
                                    value={manualAddressData}
                                    onChangeText={(text) => { setManualAddressData(text) }}
                                    onBlur={() => { (isEmpty(manualAddressData, minLocationLength) ? setMADViolates(1) : (manualAddressData.length > maxLocationLength ? setMADViolates(2) : setMADViolates(0))) }}
                                    style={{ textAlign: "center", fontSize: 25 }}
                                />
                            </View>
                        </View>
                        {(useAuto && !locationAddress) && <Text style={styles.errorText}>Please insert the location manually</Text>}
                        {(!useAuto && MADViolates !== 0) && <Text style={styles.errorText}>{(MADViolates == 1 ? "Location is too short" : "Location is too long")}</Text>}
                    </View>

                    <View style={{ alignItems: "center", position: "relative", top: "15%" }}>
                        <Pressable onPress={() => { if (!reportingTicket) { checkForCompletion() } }}>
                            <Text style={{ fontSize: 25, padding: "15", backgroundColor: "rgb(0, 175, 229)", borderColor: "rgb(0, 129, 168)", borderWidth: 2, borderRadius: 25 }}>
                                {(!editEntryData ? (!reportingTicket ? "Report Item" : "Reporting ...") : (!reportingTicket ? "Save Edits" : "Saving Edits ..."))}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={{ alignItems: "center", paddingTop: "100%" }}>
                    </View>

                </ScrollView>
                <Pressable style={{ position: "absolute", bottom: "5%", left: "5%", width: "50", height: "50" }}
                    onPress={() => { (editEntryData ? navigation.replace("Edit Screen") : navigation.goBack()) }}>
                    <Image style={{ width: "50", height: "50" }} source={require("../assets/backIcon.png")}></Image>
                </Pressable>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
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

    header: {
        width: "100%",
        textAlign: "center",
        fontSize: 25,
        backgroundColor: "rgb(179, 255, 156)",

    },
    picture: {
        backgroundColor: "rgb(128, 225, 255)",
        borderColor: "rgb(74, 179, 211)",
        borderWidth: 2,
        borderRadius: 10,
        width: windowDimensions.width * 0.9,
        height: windowDimensions.width * 0.9,
    },
    pictureAdd: {
        backgroundColor: "rgb(128, 225, 255)",
        borderColor: "rgb(74, 179, 211)",
        borderWidth: 2,
        borderRadius: 10,
        width: 50,
        height: 50,
        //  resizeMode: "contain",
        // width: windowDimensions.width * 0.9,
        // height: windowDimensions.width * 0.9,
        // padding: windowDimensions.width * 0.3,
    },
    pictureNumber: {
        backgroundColor: "rgb(128, 225, 255)",
        borderColor: "rgb(74, 179, 211)",
        borderWidth: 2,
        textAlign: "center",
        borderRadius: 10,
        //borderWidth: 1,
        padding: 5,
        fontSize: 15,
        position: "absolute",
        left: windowDimensions.width * 0.8,
        bottom: windowDimensions.width * 0.05,
    },
    pictureRemove: {
        backgroundColor: "rgb(255, 195, 195)",
        borderColor: "red",
        borderWidth: 2,
        textAlign: "center",
        borderRadius: 10,
        //borderWidth: 1,
        padding: 5,
        fontSize: 15,
        position: "absolute",
        left: windowDimensions.width * 0.025,
        bottom: windowDimensions.width * 0.04,
    },
    primaryButton: {
        fontSize: 20,
        backgroundColor: "rgb(247, 255, 195)",
        borderColor: "yellow",
        borderWidth: 1,
        textAlign: "center",
        borderRadius: 10,
        position: "absolute",
        left: windowDimensions.width * 0.6375,
        bottom: windowDimensions.width * 0.75,
        width: 100,
        height: 50,
    }
})