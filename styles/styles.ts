import { StyleSheet, StatusBar } from "react-native";
import theme from "./constants";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: theme.colors.blackBackground,
    },

    homeScreenButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    logState: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    subtleMessageContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: theme.colors.buttonBlue,
        padding: 5,
    },

    subtleMessageText: {
        textAlign: "center",
        color: "white",
    },
});

export default styles;
