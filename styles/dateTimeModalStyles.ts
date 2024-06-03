import { StyleSheet } from "react-native";
import theme from "./constants";

const dateTimeModalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.modalOverlayBackgroundLight,
        width: "100%",
        height: "100%",
    },

    text: {
        color: "white",
        fontSize: 30,
        textAlign: "center",
    },

    innerContainer: {
        backgroundColor: theme.colors.noteMenuBackground,
        height: "100%",
        width: "100%",
        borderWidth: 1,
    },

    buttonContainer: {
        padding: 3,
    },

    tomorrowTabContainer: {
        marginBottom: 20,
    },

    snoozeForTabContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        marginBottom: 20,
    },

    todayTabContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        marginBottom: 20,
    },

    futureTabContainer: {
        marginBottom: 20,
    },

    twoButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },

    tabContainerHeader: {
        color: "white",
        fontSize: 16,
        marginLeft: 10,
    },
});

export default dateTimeModalStyles;
