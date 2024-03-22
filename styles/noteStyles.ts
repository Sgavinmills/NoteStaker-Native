import { StyleSheet } from "react-native";
import theme from "./constants";

const noteStyles = StyleSheet.create({
    noteContainer: {
        borderWidth: 1,
        borderColor: theme.colors.tileBorder,
    },

    noteTile: {
        backgroundColor: theme.colors.tileBackground,
        textAlign: "left",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    noteText: {
        fontSize: 18,
        flex: 1,
        color: theme.colors.noteText,
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

    noteEllipsis: {
        paddingTop: 13,
    },
});

export default noteStyles;
