import { StyleSheet, StatusBar } from "react-native";
import theme from "./constants";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: theme.colors.blackBackground,
    },

    homeScreenTopBarContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },

    searchContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: theme.colors.tileBorder,
        flex: 1,
        padding: 8,
        marginRight: 8,
    },

    searchText: {
        color: theme.colors.noteText,
        height: 19,
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
