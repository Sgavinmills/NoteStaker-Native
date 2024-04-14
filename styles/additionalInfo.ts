import { StyleSheet } from "react-native";
import theme from "./constants";

const additionalInfo = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.modalOverlayBackground,
        flexDirection: "column",
        flexWrap: "wrap",
        marginRight: 5,
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
});

export default additionalInfo;
