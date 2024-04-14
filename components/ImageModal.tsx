import React, { useState } from "react";
import { Modal, View, Image, StyleSheet, Dimensions, TouchableOpacity, Button } from "react-native";
import modalStyles from "../styles/modalStyles";
import { MaterialIcons } from "@expo/vector-icons"; // or your preferred icon library
import { Note } from "../types";
import { DeleteInfo } from "../types";
import DeleteModal from "./DeleteModal";

interface TileProps {
    height: number;
    width: number;
    isShowingImage: boolean;
    setIsShowingImage: React.Dispatch<React.SetStateAction<boolean>>;
    imageURI: string;
    note: Note;
}

const ImageModal: React.FC<TileProps> = ({ note, isShowingImage, setIsShowingImage, imageURI }) => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState<DeleteInfo>({
        deleteType: "",
        deleteMessage: "",
        additionalMessage: "",
    });

    const handleDelete = () => {
        setDeleteModalVisible(true);
        const deleteInfo: DeleteInfo = {
            deleteType: "deleteImage",
            deleteMessage: "Remove image from note?",
            additionalMessage: "",
        };

        setDeleteInfo(deleteInfo);
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

            {deleteModalVisible && (
                <DeleteModal
                    setDeleteModalVisible={setDeleteModalVisible}
                    deleteModalVisible={deleteModalVisible}
                    deleteInfo={deleteInfo}
                    note={note}
                    setCallingComponentVisible={setIsShowingImage}
                />
            )}
        </Modal>
    );
};

export default ImageModal;
