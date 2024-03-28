import { View, GestureResponderEvent, TouchableWithoutFeedback, Modal } from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Note } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoteFromAllCategories, updateNote, setArrows, updateMenuOverlay } from "../redux/slice";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";
import { AppDispatch } from "../redux/store/store";

interface TileProps {
    note: Note;
    setIsShowingNoteMenu: React.Dispatch<React.SetStateAction<boolean>>;
    isShowingNoteMenu: boolean;
    xCoordNoteMenu: number;
    yCoordNoteMenu: number;
    subCategoryID?: string;
    categoryID?: string;
}

const NoteMenu: React.FC<TileProps> = ({
    note,
    isShowingNoteMenu,
    setIsShowingNoteMenu,
    xCoordNoteMenu,
    yCoordNoteMenu,
    subCategoryID,
    categoryID,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleOutsidePress = () => {
        setIsShowingNoteMenu(false);
    };

    const handleCameraPress = (event: GestureResponderEvent) => {
        pickImage();
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });
        setIsShowingNoteMenu(false);
        if (!result.canceled) {
            const imageURI = result.assets[0].uri;
            dispatch(updateNote({ ...note, imageURI: imageURI }));
        }
    };

    const handleDelete = () => {
        // TODO : Add confirmation check before deleting.
        const id = note.id;
        dispatch(deleteNoteFromAllCategories(id));
    };

    const handleArrowsPress = () => {
        // dispatch(updateMenuOverlay(true));
        // setIsShowingNoteMenu(false);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isShowingNoteMenu}
            onRequestClose={() => {
                setIsShowingNoteMenu(false);
            }}
        >
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={noteStyles.noteMenuContainer}>
                    <View
                        style={[
                            noteStyles.noteIconContainer,
                            { top: yCoordNoteMenu, left: xCoordNoteMenu - 0.7 * Dimensions.get("window").width },
                        ]}
                    >
                        <TouchableWithoutFeedback onPress={handleCameraPress}>
                            <FontAwesome name="camera" style={noteStyles.noteIconText} />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={handleDelete}>
                            <FontAwesome name="times" style={[noteStyles.noteIconText, noteStyles.noteIconTextCross]} />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={handleArrowsPress}>
                            <Entypo name="select-arrows" style={[noteStyles.noteIconText]} />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default NoteMenu;
