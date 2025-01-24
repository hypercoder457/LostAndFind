import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For data storage
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './screens/LoadingScreen';
import RegisterAccountScreen from './screens/RegisterAccountScreen';
import HomeScreen from './screens/HomeScreen';


/*
--------------Logs
Date: 1/20/25 | User: Christopher |
Content: Added pages and a proper loading screen
Date: 1/21/25 | User: Christopher |
Content: Added home page content
Date: _______ | User: ____ |
Content: ____________________________
*/

export default function App() {
  //Initial Setup
  AsyncStorage.clear(); // Leave this in to force the register screen

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
      "Registration Page": {
        screen: RegisterAccountScreen,
      },
      "Home Page": {
        screen: HomeScreen,
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