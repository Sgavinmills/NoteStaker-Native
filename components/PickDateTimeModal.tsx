import { Modal, Text, View } from "react-native";
import dateTimeModalStyles from "../styles/dateTimeModalStyles";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { addDontForgetMe, updateNote } from "../redux/slice";
import { AppDispatch } from "../redux/store/store";
import PickDateTimeOptions from "./PickDateTimeOptions";
import { DontForgetMeConfig, IDs, reminderConfig } from "../types";
import { setSubtleMessage } from "../redux/slice";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";

interface TileProps {
    setPickDateTimeModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    pickDateTimeModalVisible: boolean;
    ids: IDs;
    modalType: "dontForgetMe" | "reminder";
}

const PickDateTimeModal: React.FC<TileProps> = ({
    modalType,
    setPickDateTimeModalVisible,
    pickDateTimeModalVisible,
    ids,
}) => {
    const note = useSelector((state: RootState) => state.memory.notes[ids.noteID]);
    const dispatch = useDispatch<AppDispatch>();

    const handleOptionPress = (reminderTime?: Date) => {
        if (reminderTime) {
            if (modalType === "dontForgetMe") {
                const config: DontForgetMeConfig = {
                    noteID: ids.noteID,
                    subCategoryID: ids.subCategoryID ? ids.subCategoryID : "",
                    categoryID: ids.categoryID,
                    date: reminderTime.toISOString(),
                };
                dispatch(addDontForgetMe(config));
                dispatch(
                    setSubtleMessage({
                        message: "Will remind at " + reminderTime.toLocaleString(),
                        timeOut: 3,
                    })
                );
                setPickDateTimeModalVisible(false);
                return;
            }

            if (modalType === "reminder") {
                scheduleNotification({
                    note: note,
                    reminderText: note.note,
                    reminderTime: reminderTime,
                });
                setPickDateTimeModalVisible(false);
                dispatch(
                    setSubtleMessage({
                        message: "Will remind at " + reminderTime.toLocaleString(),
                        timeOut: 3,
                    })
                );
                return;
            }
        }

        // add the customer date picker stuff here.
        DateTimePickerAndroid.open({
            value: new Date(),
            onChange: onChangeDate,
            mode: "date",
            is24Hour: true,
        });
    };

    const scheduleNotification = async (reminder: reminderConfig) => {
        const notificationID = await schedulePushNotification(reminder);
        const noteCopy = { ...reminder.note };
        noteCopy.notificationID = notificationID;
        noteCopy.notificationTime = reminder.reminderTime.toISOString();
        dispatch(updateNote(noteCopy));
    };

    async function schedulePushNotification(reminder: reminderConfig) {
        const now = new Date();
        const interval = reminder.reminderTime.getTime() - now.getTime();
        const notificationID = await Notifications.scheduleNotificationAsync({
            content: {
                title: "NoteStaker",
                body: reminder.reminderText, // prob wanna restrict length of this
                data: { noteID: reminder.note.id },
            },
            trigger: { seconds: interval / 1000 },
        });

        return notificationID;
    }

    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "set" && selectedDate) {
            showTimePicker(selectedDate);
        }
    };

    const showTimePicker = (currentDate: Date) => {
        DateTimePickerAndroid.open({
            value: currentDate,
            onChange: onChangeTime,
            mode: "time",
            is24Hour: true,
        });
    };

    const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "set" && selectedDate) {
            if (modalType === "dontForgetMe") {
                const config: DontForgetMeConfig = {
                    noteID: ids.noteID,
                    subCategoryID: ids.subCategoryID ? ids.subCategoryID : "",
                    categoryID: ids.categoryID,
                    date: selectedDate.toISOString(),
                };
                dispatch(addDontForgetMe(config));

                dispatch(
                    setSubtleMessage({
                        message: "Will remind at " + new Date(selectedDate).toLocaleString(),
                        timeOut: 3,
                    })
                );
                setPickDateTimeModalVisible(false);
                return;
            }

            if (modalType === "reminder") {
                scheduleNotification({
                    note: note,
                    reminderText: note.note,
                    reminderTime: selectedDate,
                });
                setPickDateTimeModalVisible(false);
                setSubtleMessage({
                    message: "Will remind at " + new Date(selectedDate).toLocaleString(),
                    timeOut: 3,
                });
            }
        }
    };

    const handleClose = () => {
        if (modalType !== "reminder") {
            setPickDateTimeModalVisible(false);
        }
    };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={pickDateTimeModalVisible}
            onRequestClose={() => {
                handleClose();
            }}
        >
            <View style={dateTimeModalStyles.modalContainer}>
                <View style={dateTimeModalStyles.innerContainer}>
                    <Text style={dateTimeModalStyles.text}>Set date/time</Text>
                    <PickDateTimeOptions
                        setPickDateTimeModalVisible={setPickDateTimeModalVisible}
                        handleOptionPress={handleOptionPress}
                        modalType={modalType}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default PickDateTimeModal;
