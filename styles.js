import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    loadingBackground: {
        flex: 1,
        backgroundColor: "rgb(100, 100, 100)",
        alignItems: "center",
        justifyContent: "center",
    },

    mainOptionIcon: {
        backgroundColor: "rgb(198, 232, 225)",
        width: 150,
        height: 150,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
    },
    mainContainer: {
        backgroundColor: "rgb(145, 187, 179)",
        height: "100%"
    },
    icon: {
        height: 100,
        width: 100
    },
    textWithIcon: { fontSize: 35 },
});
export default styles;

// All colors for theme
/*
#FBFCFC
#D2E4DE
#2CC9CE
#C8DEE0
#1DAEE8
*/