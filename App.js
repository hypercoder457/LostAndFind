import { StatusBar } from 'expo-status-bar'
import React, {useState} from 'react'
import { StyleSheet, Text, TouchableHighlight, Image, TextInput, View, SafeAreaView, Alert } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list' // For dropdown list
import AsyncStorage from '@react-native-async-storage/async-storage' // For data storage

export default function App() {
  //JavaScript
  const [selected, setSelected] = React.useState("")
  const countiesData = [
    {key:'1', value:'Wake County'},
    {key:'2', value:'Evil Wake County'},
    {key:'23', value:'Durham County'},
  ];

  // Local User Data Manager
  class localDataManager {
    static dataLoaded = false;
    static loadingFailed = false;
    static userData = {
      name: "",
      tBNP: "0", // Time Before Next Post
    };

    static updateUserData(key, value) {
      if (typeof(key) != "string" || typeof(value) != "string") {
        console.warn("Unable to update user data because key/value is not a string!");
        return;
      }
      if (!key in this.userData) {
        console.warn("Unable to update user data because key is not a valid key entry!");
        return;
      }
      this.userData[key] = value;
    }

    static async saveUserData() {
      if (!this.dataLoaded) {
        console.warn("User data has not been loaded. Unable to save!");
        return;
      }
      if (this.loadingFailed) {
        console.warn("User data failed to load properly. To avoid corruption, user data will not save!");
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
      try {
        for (let key in this.userData) {
          const valueData = await AsyncStorage.getItem(toString(key));
          if (valueData !== null) {
            this.userData[key] = valueData;
            console.log(this.userData[key]);
          }
        }
        console.log("User data loaded successfully!");
        console.log(this.userData);
      } catch(err) {
        this.loadingFailed = true;
        console.warn("Unable to load user data! Error:" + err);
      } finally {
        this.dataLoaded = true;
      }
    }
  };
  
  localDataManager.loadUserData();


  //HTML
  return(
   <SafeAreaView styele={styles.container}>
    <SelectList
      searchPlaceholder="Can't find your county? Search for it here!"
      notFoundText='Sorry but that county does not exist in North Carolina!'
      data={countiesData}
      setSelected={setSelected}
      save='value'
      onSelect={() => {
        Alert.alert("Notice", `You selected ${selected}`)
      }}
    />
    <TouchableHighlight onPress={() => {
      if (localDataManager.dataLoaded) {
        Alert.alert("Notice", "Your lost item data has been sent!")
        localDataManager.updateUserData("name", "John Rolph")
        console.log("Name: "+localDataManager.userData.name);
        localDataManager.saveUserData();
      }
      }}>
      <Text>Submit Data</Text>
    </TouchableHighlight>
   </SafeAreaView>
  )
}

// CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(141, 128, 128)',
  },

});
