import { StyleSheet } from "react-native";
import theme from "./constants";

const noteStyles = StyleSheet.create({
    noteTile: {
        backgroundColor: theme.colors.tileBackground,
        textAlign: "left",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: theme.colors.tileBorder,
    },

    noteContainer: {
        flex: 1,
    },

    bottomBorder: {
        borderBottomWidth: 1,
    },

    noteText: {
        fontSize: 16,
        color: theme.colors.noteText,
        paddingBottom: 8,
        paddingTop: 8,
    },

    noteTextFocused: {
        borderBottomWidth: 1,
        borderStyle: "dashed",
        borderBottomColor: theme.colors.tileBorder,
    },

    tileIconsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    icons: {
        padding: 10,
        fontSize: 18,
        color: theme.colors.noteText,
    },

    completedCheckbox: {
        fontSize: 14,
    },

    notCompletedCheckbox: {
        fontSize: 14,
        opacity: 0.4,
    },

    noteEllipsis: {
        paddingTop: 13,
    },

    lastMargin: {
        marginBottom: 500,
    },

    noteIconContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    noteIconText: {
        color: theme.colors.noteText,
        paddingRight: 20,
        fontSize: 20,
    },
    noteIconTextCross: {
        fontSize: 22,
        color: "red",
    },
});

export default noteStyles;
