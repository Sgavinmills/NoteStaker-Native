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

    topRadius: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },

    bottomRadius: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
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
        color: theme.colors.noteText,
        fontWeight: "bold",
    },

    searchTilePlaceholderText: {
        fontSize: 16,
        color: theme.colors.noteText,
    },

    padlock: {
        fontSize: 18,
        color: theme.colors.noteText,
    },

    categoryTextContainer: {
        flex: 1,
    },

    plusIconText: {
        fontSize: 20,
        color: theme.colors.noteText,
    },

    caretIconText: {
        fontSize: 33,
        color: theme.colors.noteText,
    },

    ellipsisIconText: {
        fontSize: 24,
        color: theme.colors.noteText,
    },

    binocularCategoryText: {
        fontSize: 20,
        color: theme.colors.noteText,
    },

    binocularNoteText: {
        fontSize: 14,
        color: theme.colors.noteText,
    },

    binocularsIconText: {
        fontSize: 24,
        color: theme.colors.noteText,
        marginRight: 30,
    },

    subCategoryText: {
        fontSize: 20,
        color: theme.colors.noteText,
    },

    newCategoryText: {
        fontSize: 30,
        fontWeight: "bold",
        color: theme.colors.noteText,
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

    moveArrows: {
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 45,
    },

    dontForgetMeBell: {
        color: "gold",
        fontSize: 25,
        zIndex: 100,
    },

    dontForgetMeContainer: {
        position: "absolute",
        top: 0,
        zIndex: 100,
    },
});

export default catStyles;
