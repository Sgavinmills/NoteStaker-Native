import { StyleSheet } from "react-native";
import theme from "./constants";

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.modalOverlayBackground,
        width: "100%",
        height: "100%",
    },

    modalTextInputContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    newCategoryModalIconText: {
        fontSize: 50,
        fontWeight: "bold",
        color: theme.colors.categoryText,
        textAlign: "right",
        marginRight: "8%",
    },

    modalCloseCategoryIconContainer: {
        width: "100%",
    },

    modalInput: {
        width: "65%",
        marginBottom: 20,
        marginTop: 40,
        padding: 10,
        backgroundColor: theme.colors.modalTextInputBackgroundColor,
        borderRadius: 5,
    },

    modalInputError: {
        borderWidth: 1,
        borderColor: "red",
    },

    modalButtonContainer: {
        width: "65%",
    },
});

export default modalStyles;
