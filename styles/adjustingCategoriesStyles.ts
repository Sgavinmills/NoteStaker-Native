import { StyleSheet } from "react-native";
import theme from "./constants";

const adjustCatStyles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.modalOverlayBackground,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
        padding: 20,
    },

    tab: {
        backgroundColor: theme.colors.adjustCategoryMainTab,
        borderRadius: 4,
        padding: 7,
    },

    subTab: {
        backgroundColor: theme.colors.adjustCategorySubTab,
        borderRadius: 4,
        padding: 7,
    },

    text: {
        color: "white",
    },

    tabSelected: {
        backgroundColor: theme.colors.adjustCategoryTabSelected,
    },

    arrow: {
        paddingLeft: 15,
        paddingRight: 12,
    },

    errorText: {
        color: theme.colors.categoryText,
        position: "absolute",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        fontSize: 12,
    },
});

export default adjustCatStyles;
