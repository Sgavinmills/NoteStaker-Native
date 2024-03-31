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

    errorTextContainer: {
        position: "relative",
        width: "100%",
        alignItems: "center",
    },

    text: {
        color: "white",
        textAlign: "center",
    },

    errorText: {
        color: theme.colors.categoryText,
        position: "absolute",
        top: 10,
    },

    modalButtonContainer: {
        width: "65%",
    },

    deleteButtonContainer: {
        width: "65%",
        margin: 10,
        justifyContent: "space-between",
    },

    deleteButton: {
        marginBottom: 15,
    },

    imageContainer: {
        backgroundColor: "black",
    },

    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 10,
        borderRadius: 20,
    },

    // image modal
    buttonContainer: {
        position: "absolute",
        bottom: 10,
    },
});

export default modalStyles;
