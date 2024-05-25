import React, { useEffect, useState } from "react";
import { View, Text, Animated, Modal } from "react-native";
import styles from "../styles/styles";
import { RootState } from "../redux/store/store";
import { AppDispatch } from "../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import { setSubtleMessage } from "../redux/slice";

interface TileProps {}

const SubtleMessage: React.FC<TileProps> = ({}) => {
    const subtleMessage = useSelector((state: RootState) => state.memory.subtleMessage);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        if (subtleMessage.timeOut > 0) {
            setTimeout(() => {
                dispatch(
                    setSubtleMessage({
                        message: "",
                        timeOut: -1,
                    })
                );
            }, subtleMessage.timeOut * 1000);
        }
    }, [subtleMessage]);

    return (
        <>
            {subtleMessage.message !== "" && (
                <>
                    <View style={styles.subtleMessageContainer}>
                        <View>
                            <Text style={styles.subtleMessageText}>{subtleMessage.message}</Text>
                        </View>
                    </View>
                </>
            )}
        </>
    );
};

export default SubtleMessage;
