import { StyleSheet } from "react-native";
import theme from "./constants";

const arrowStyles = StyleSheet.create({
    arrowsContainer: {
        backgroundColor: theme.colors.modalOverlayBackground,
        flexDirection: "row",
        justifyContent: "space-evenly",
    },

    arrowUp: {
        fontSize: 150,
        color: "#2196F3",
    },
});

export default arrowStyles;
