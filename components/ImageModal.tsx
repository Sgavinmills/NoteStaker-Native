import React from "react";
import { Modal, View, Image, StyleSheet, Dimensions, TouchableOpacity, Button } from "react-native";
import modalStyles from "../styles/modalStyles";
import { MaterialIcons } from "@expo/vector-icons"; // or your preferred icon library
import { Note } from "../types";
import { AppDispatch } from "../redux/store/store";
import { useDispatch } from "react-redux";
import { deleteNoteFromAllCategories, updateNote } from "../redux/slice";

interface TileProps {
    height: number;
    width: number;
    isShowingImage: boolean;
    setIsShowingImage: React.Dispatch<React.SetStateAction<boolean>>;
    imageURI: string;
    note: Note;
}

// TODO - Implement delete photo functionality, inc confirmation check.
const ImageModal: React.FC<TileProps> = ({ note, height, width, isShowingImage, setIsShowingImage, imageURI }) => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = () => {
        setIsShowingImage(false);

        if (note.note === "") {
            dispatch(deleteNoteFromAllCategories(note.id));
            return;
        }
        const noteCopy = { ...note };
        dispatch(updateNote({ ...noteCopy, imageURI: "" }));
    };
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isShowingImage}
            onRequestClose={() => {
                setIsShowingImage(false);
            }}
        >
            <View style={modalStyles.modalContainer}>
                <View style={modalStyles.imageContainer}>
                    <Image
                        source={{ uri: imageURI }}
                        style={{ width: screenWidth, height: screenHeight }}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        style={modalStyles.closeButton}
                        onPress={() => {
                            setIsShowingImage(false);
                        }}
                    >
                        <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={modalStyles.buttonContainer}>
                    <Button onPress={handleDelete} title="Delete photo" />
                </View>
            </View>
        </Modal>
    );
};

export default ImageModal;
