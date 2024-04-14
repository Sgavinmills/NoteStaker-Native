import { StyleSheet } from "react-native";
import theme from "./constants";

const menuOverlayStyles = StyleSheet.create({
    modal: {
        flex: 1,
    },

    container: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },

    contentContainer: {
        backgroundColor: theme.colors.modalOverlayBackground,
        justifyContent: "space-evenly",
        padding: 10,
        paddingBottom: 15,
    },

    text: {
        color: "white",
    },

    menuItemContainer: {
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
    },

    icons: {
        color: "white",
        paddingRight: 15,
        fontSize: 20,
    },

    crossIcon: { color: "red" },
});

export default menuOverlayStyles;
