import React, { useEffect, useState } from "react";
import { View, Text, Animated, Modal } from "react-native";
import styles from "../styles/styles";

interface TileProps {
    message: string;
    visible: boolean;
    setSubtleMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubtleMessage: React.FC<TileProps> = ({ message, visible, setSubtleMessage }) => {
    const handleClose = () => {
        setSubtleMessage(false);
    };

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleClose}>
            <View style={styles.subtleMessageContainer}>
                <View>
                    <Text style={styles.subtleMessageText}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

export default SubtleMessage;
