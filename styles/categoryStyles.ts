import { StyleSheet } from "react-native";
import theme from "./constants";

const catStyles = StyleSheet.create({
    categoryListContainer: {
        flex: 1,
    },

    subCategoryContainer: {
        padding: 0,
    },

    lastMargin: {
        marginBottom: 500,
    },

    categoryTile: {
        borderWidth: 1,
        borderColor: theme.colors.tileBorder,
        backgroundColor: theme.colors.tileBackground,
        textAlign: "left",
        paddingRight: 10,
        paddingLeft: 15,
        paddingTop: 20,
        paddingBottom: 10,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    categoryTileSelected: {
        backgroundColor: theme.colors.tileBackgroundSelected,
    },

    categoryTileFirst: {
        marginTop: 0,
    },

    subCategoryTile: {
        borderWidth: 1,
        borderColor: theme.colors.tileBorder,
        backgroundColor: theme.colors.tileBackground,
        textAlign: "left",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    categoryText: {
        fontSize: 20,
        color: theme.colors.categoryText,
        fontWeight: "bold",
    },

    categoryTextContainer: {
        flex: 1,
    },

    plusIconText: {
        fontSize: 20,
        color: theme.colors.categoryText,
    },

    caretIconText: {
        fontSize: 33,
        color: theme.colors.categoryText,
    },

    ellipsisIconText: {
        fontSize: 24,
        color: theme.colors.noteText,
    },

    subCategoryText: {
        fontSize: 20,
        color: theme.colors.categoryText,
    },

    newCategoryText: {
        fontSize: 30,
        fontWeight: "bold",
        color: theme.colors.categoryText,
        textAlign: "right",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },

    tileIconsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    icons: {
        paddingLeft: 10,
        paddingRight: 10,
    },
});

export default catStyles;
