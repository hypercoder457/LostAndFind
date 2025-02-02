import React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './screens/LoadingScreen';
import LogInScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ReportAnItemScreen from './screens/ReportAnItemScreen';
import RecoverScreen from './screens/RecoverScreen';
import ItemInfoScreen from './screens/ItemInfoScreen';

export default function App() {
  //Initial Setup
  //AsyncStorage.clear(); // Leave this in to force the register screen

  // Pages
  const RootStack = createNativeStackNavigator({
    screenOptions: {
      headerStyle: { backgroundColor: 'grey' },
      animation: "none",
    },
    screens: {
      loadScreen: {
        screen: LoadingScreen,
        options: {
          headerShown: false,
        },
      },
      "Log In": {
        screen: LogInScreen,
        options: {
          headerShown: false,
        },
      },
      "Home Page": {
        screen: HomeScreen,
        options: {
          headerShown: false,
        },
      },
      "Report An Item": {
        screen: ReportAnItemScreen,
        options: {
          headerShown: false,
        },
      },
      "Recover An Item": {
        screen: RecoverScreen,
        options: {
          headerShown: false,
        },
      },
      "Item Info Screen": {
        screen: ItemInfoScreen,
        options: {
          headerShown: false,
        },
      },
    },
  });
  const Navigation = createStaticNavigation(RootStack);

  //Start Up
  return (
    <Navigation />
  );
}

/*
  const [selected, setSelected] = React.useState("")
  const countiesData = [
    {key:'1', value:'Wake County'},
    {key:'2', value:'Evil Wake County'},
    {key:'23', value:'Durham County'},
  ];

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
*/