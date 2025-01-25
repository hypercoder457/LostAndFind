import React, { useEffect, useState, useRef, useDebugValue } from "react";
import { useForm } from "react-hook-form";
import { Image, Dimensions, ScrollView, View, SafeAreaView, TextInput, StyleSheet, Text, Pressable } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';

import LocalDataManager from "../LocalDataManager";
import CameraManager from "../CameraManager";
import DatabaseKeys from "../DatabaseKeys";

const windowDimensions = Dimensions.get('window');

export default function ReportAnItem(props) {

    const [itemNameData, setItemName] = React.useState("");
    const [itemNameColorData, setItemColor] = React.useState("rgb(0, 0, 0)");

    const [itemDescData, setItemDesc] = React.useState("");

    const [categoryData, setCategory] = React.useState("");

    const [imageData, setImageData] = React.useState([]);
    let imageDisplayer = useRef(null);
    let imageInserter = useRef(null);
    const [imageInserterVisible, setInserterVisibilty] = React.useState(true);

    function isEmpty(text) {
        return (!(/[a-zA-Z]/.test(text))||text.length <= 3);
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
                        console.log("Index: "+i);
                        setImageData((oldImageData) => {
                            const updatedImageData = [...oldImageData, photos.assets[i]];
                            handleImageInserter(updatedImageData.length);
                            return(updatedImageData);
                        });
                        if (imageData.length >= 3) {
                            break;
                        }
                    }
                }
            }
        }
    }

    function removeImegeFromPage(index) {
        const imageDataCopy = [...imageData];
        imageDataCopy.splice(index, 1);
        setImageData(imageDataCopy);
        handleImageInserter(imageData.length - 2);
    }

    return (
        <SafeAreaView>
            <Text>Name</Text>
            <TextInput 
                placeholder="Item Name"
                value={itemNameData}
                onChangeText={(text) => {
                    setItemName(text);
                    setItemColor("rgb(0, 0, 0)");
                }}
                onBlur={() => {(isEmpty(itemNameData) ? setItemColor("rgb(255, 0, 0)") : setItemColor("rgb(0, 255, 0)"))}}
                style = {{color: itemNameColorData}}
            />

            <Text>Category</Text>
            <SelectList
                search={false}
                data={DatabaseKeys.categories}
                setSelected={setCategory}
                save='value'
                dropdownStyles={{zIndex: 999, position: "absolute", top: 40, marginLegt: 20, marginRight: 20}}
            />

            <Text>Images</Text>
            <ScrollView ref={imageDisplayer} style={{display: "flex", backgroundColor: "rgb(255, 0, 0)"}} horizontal>
                {imageData.map((picture, index) => (
                    <Pressable key={index}>
                        <Image source={{uri: picture.uri}} style={styles.picture}></Image>
                        <Pressable onPress={() => {removeImegeFromPage(index)}}>
                            <Text style={styles.pictureRemove}>Remove</Text>
                        </Pressable>
                        <Text style={styles.pictureNumber}>{index+1}/3</Text>
                    </Pressable>
                ))}
                <Pressable ref={imageInserter} style={{backgroundColor: "rgb(0, 255, 47)", display: (imageInserterVisible ? "flex" : "none")}} onPress={() => {addImagesToPage()}}>
                    <Image source={require("../assets/plusIcon.png")} style={styles.picture}/>
                </Pressable>
            </ScrollView>

            <Text>Description</Text>
            <TextInput 
                placeholder="Description"
                value={itemDescData}
                onChangeText={(text) => {setItemDesc(text)}}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    picture: {
        width: windowDimensions.width*0.9, 
        height: windowDimensions.width*0.9
    },
    pictureNumber: {
        borderWidth: 1,
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255, 0, 0)",
        padding: 5,
        fontSize: 15,
        position: "absolute",
        left: windowDimensions.width*0.8,
        bottom: windowDimensions.width*0.05,
    },
    pictureRemove: {
        borderWidth: 1,
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255, 0, 0)",
        padding: 5,
        fontSize: 15,
        position: "absolute",
        left: windowDimensions.width*0.05,
        bottom: windowDimensions.width*0.05,
    }
})