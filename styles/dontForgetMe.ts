import { StyleSheet } from "react-native";
import theme from "./constants";

const dontForgetMe = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.modalOverlayBackground,
        flexDirection: "column",
        gap: 5,
        marginBottom: 10,
    },

    tabContainer: {
        // backgroundColor: theme.colors.modalOverlayBackground,
        flexDirection: "row",
        flexWrap: "wrap",
        marginRight: 5,
        gap: 5,
    },

    text: {
        color: "white",
        paddingRight: 5,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        overflow: "hidden",
    },

    tab: {
        backgroundColor: theme.colors.adjustCategorySubTab,
        borderRadius: 4,
        padding: 7,
    },
});

export default dontForgetMe;
