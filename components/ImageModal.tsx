import React from "react";
import { Modal, View, Image, StyleSheet, Dimensions, TouchableOpacity, Button } from "react-native";
import modalStyles from "../styles/modalStyles";
import { MaterialIcons } from "@expo/vector-icons"; // or your preferred icon library
interface TileProps {
    height: number;
    width: number;
    isShowingImage: boolean;
    setIsShowingImage: React.Dispatch<React.SetStateAction<boolean>>;
    imageURI: string;
}

// TODO - Implement delete photo functionality, inc confirmation check.
const ImageModal: React.FC<TileProps> = ({ height, width, isShowingImage, setIsShowingImage, imageURI }) => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

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
                    <Button onPress={() => {}} title="Delete photo" />
                </View>
            </View>
        </Modal>
    );
};

export default ImageModal;
