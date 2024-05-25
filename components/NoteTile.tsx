import {
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    GestureResponderEvent,
    TouchableWithoutFeedback,
    Keyboard,
    BackHandler,
} from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import categoryStyles from "../styles/categoryStyles";

import { MenuOverlay, HeightUpdateInfo, NewNoteData, DontForgetMeConfig } from "../types";
import { useDispatch } from "react-redux";
import {
    addDontForgetMe,
    createNewNote,
    deleteNote,
    updateCategory,
    updateMenuOverlay,
    updateNote,
    updateNoteHeight,
    updateNoteSilently,
    updateSubCategory,
} from "../redux/slice";
import { useEffect, useState } from "react";
import ImageModal from "./ImageModal";
import { AppDispatch } from "../redux/store/store";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import React from "react";
import { getEmptyOverlay, moveDownList, moveToEnd, moveToStart, moveUpList } from "../utilFuncs/utilFuncs";
import * as ImagePicker from "expo-image-picker";

interface TileProps {
    noteID: string;
    isLastCategory: boolean;
    isLastSubCategory?: boolean;
    isLastNote: boolean;
    subCategoryID: string;
    categoryID: string;
    index: number;
    subCategoryIndex: number;
    parentCategoryIndex: number;
    isSearchTile: boolean;
    moving: string;
    setMoving: React.Dispatch<React.SetStateAction<string>>;
}

const NoteTile: React.FC<TileProps> = ({
    noteID,
    isLastNote,
    isLastSubCategory,
    categoryID,
    subCategoryID,
    index,
    subCategoryIndex,
    parentCategoryIndex,
    isSearchTile,
    moving,
    setMoving,
}) => {
    const note = useSelector((state: RootState) => state.memory.notes[noteID]);
    const isSelected = note.isSelected;
    const dispatch = useDispatch<AppDispatch>();

    const dontForgetMeList = useSelector((state: RootState) => state.memory.dontForgetMe);
    const dontForgetMeCalc = () => {
        const dontForgetMeRef = dontForgetMeList[note.id];

        if (dontForgetMeRef) {
            if (dontForgetMeRef.location[0] === categoryID && dontForgetMeRef.location[1] === subCategoryID) {
                const currentTime = new Date();
                const reminderTime = new Date(dontForgetMeRef.date);
                return reminderTime.getTime() < currentTime.getTime();
            }
        }

        return false;
    };

    const dontForgetMe = dontForgetMeCalc();
    const [noteEditMode, setNoteEditMode] = useState(note.isNewNote);
    const [isShowingImage, setIsShowingImage] = useState(false);
    console.log("----------re render note: " + note.note);
    const handleNoteChange = (text: string) => {
        const noteCopy = { ...note, note: text };
        if (noteCopy.isNewNote) {
            noteCopy.isNewNote = false;
        }
        dispatch(updateNote(noteCopy));
    };

    useEffect(() => {
        if (note.isSelected) {
            const noteCopy = { ...note };
            noteCopy.isSelected = false;
            dispatch(updateNoteSilently(noteCopy));
        }
    }, []);

    useEffect(() => {
        const backAction = () => {
            if (noteEditMode) {
                setNoteEditMode(false);
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove(); // Cleanup the event listener
    });

    const handleNoteBlur = () => {
        setNoteEditMode(false);

        if (note.note === "" && note.imageURI === "") {
            const id = note.id;
            dispatch(deleteNote(id));
            return;
        }

        if (note.isNewNote) {
            const noteCopy = { ...note, isNewNote: false };
            dispatch(updateNote(noteCopy));
        }
    };

    const handleMenuPress = (event: GestureResponderEvent) => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        if (moving) {
            setMoving("");
            return true;
        }

        const newOverlay: MenuOverlay = {
            isShowing: true,
            menuType: "note",
            menuData: {
                noteID: note.id,
                categoryID: categoryID ? categoryID : "",
                subCategoryID: subCategoryID ? subCategoryID : "",
                categoryIndex: parentCategoryIndex,
                subCategoryIndex: subCategoryIndex !== undefined ? subCategoryIndex : null,
                noteIndex: index,
                isSearchTile: isSearchTile,
                subMenu: "",
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
    };

    const handleImagePress = () => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        if (moving) {
            setMoving("");
            return true;
        }

        dispatch(updateMenuOverlay(getEmptyOverlay()));
        setIsShowingImage(true);
    };

    const handleCameraPress = (event: GestureResponderEvent) => {
        pickImage();
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const imageURI = result.assets[0].uri;
            const noteCopy = { ...note };
            dispatch(updateNote({ ...noteCopy, imageURI: imageURI }));
        }
    };

    const handleCheckboxPress = () => {
        const noteCopy = { ...note };
        noteCopy.completed = !noteCopy.completed;
        dispatch(updateNote(noteCopy));
    };

    const handleTouchNote = () => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        if (moving) {
            setMoving("");
            return true;
        }

        // TODO - DONT THINK WE NEED THESE CLEAR OVERLAYS ANYMORE.
        dispatch(updateMenuOverlay(getEmptyOverlay()));

        setNoteEditMode(true);
    };

    const handleCategoryLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;

        const update: HeightUpdateInfo = {
            newHeight: height,
            categoryIndex: parentCategoryIndex,
            subCategoryIndex: subCategoryIndex >= -1 ? subCategoryIndex : -1,
            noteIndex: index,
        };

        dispatch(updateNoteHeight(update));
    };

    const addBottomRadius = () => {
        if (!subCategoryID) {
            return isLastNote;
        }

        return isLastSubCategory && isLastNote;
    };

    const handleLongPress = () => {
        if (!isSearchTile) {
            setMoving(noteID);
        }
    };

    const category = useSelector((state: RootState) => state.memory.categories[categoryID]);
    const subCategory = useSelector((state: RootState) => state.memory.subCategories[subCategoryID]);
    const handleUpPress = () => {
        if (subCategoryID) {
            const subCategoryCopy = { ...subCategory };

            const newList = [...subCategoryCopy.notes];
            const currentIndex = newList.findIndex((ref) => ref.id === noteID);
            if (currentIndex > 0) {
                subCategoryCopy.notes = moveUpList(newList, currentIndex);
                dispatch(updateSubCategory(subCategoryCopy));
            }
            return;
        } else {
            const parentCategoryCopy = { ...category };

            const newList = [...parentCategoryCopy.notes];
            const currentIndex = newList.findIndex((ref) => ref.id === noteID);
            if (currentIndex > 0) {
                parentCategoryCopy.notes = moveUpList(newList, currentIndex);
                dispatch(updateCategory(parentCategoryCopy));
            }
            return;
        }
    };

    const handleDownPress = () => {
        if (subCategoryID) {
            const subCategoryCopy = { ...subCategory };

            const newList = [...subCategoryCopy.notes];
            const currentIndex = newList.findIndex((ref) => ref.id === noteID);
            if (currentIndex < newList.length - 1) {
                subCategoryCopy.notes = moveDownList(newList, currentIndex);
                dispatch(updateSubCategory(subCategoryCopy));
            }
            return;
        } else {
            const categoryCopy = { ...category };

            const newList = [...categoryCopy.notes];
            const currentIndex = newList.findIndex((ref) => ref.id === noteID);
            if (currentIndex < newList.length - 1) {
                categoryCopy.notes = moveDownList(newList, currentIndex);
                dispatch(updateCategory(categoryCopy));
            }
            return;
        }
    };

    // TODO - MERGE THESE FUNCTIONS, DONT NEED 4 MASSIVE FUNCS TO DO VERY SIMILAR STUFF.
    // REPEAT IN CAT AND SUB CAT TILES.
    // AT LEAST ONLY NEED 1 PER DIRECTION

    const handleUpToTopPress = () => {
        if (subCategoryID) {
            const subCategoryCopy = { ...subCategory };

            const newList = [...subCategoryCopy.notes];
            const currentIndex = newList.findIndex((ref) => ref.id === noteID);
            if (currentIndex > 0) {
                subCategoryCopy.notes = moveToStart(newList, currentIndex);
                dispatch(updateSubCategory(subCategoryCopy));
            }
            return;
        } else {
            const categoryCopy = { ...category };

            const newList = [...categoryCopy.notes];
            const currentIndex = newList.findIndex((ref) => ref.id === noteID);
            if (currentIndex > 0) {
                categoryCopy.notes = moveToStart(newList, currentIndex);
                dispatch(updateCategory(categoryCopy));
            }
            return;
        }
    };

    const handleDownToBottomPress = () => {
        if (subCategoryID) {
            const subCategoryCopy = { ...subCategory };

            const newList = [...subCategoryCopy.notes];
            const currentIndex = newList.findIndex((ref) => ref.id === noteID);
            if (currentIndex < newList.length - 1) {
                subCategoryCopy.notes = moveToEnd(newList, currentIndex);
                dispatch(updateSubCategory(subCategoryCopy));
            }
            return;
        } else {
            const categoryCopy = { ...category };

            const newList = [...categoryCopy.notes];
            const currentIndex = newList.findIndex((ref) => ref.id === noteID);
            if (currentIndex < newList.length - 1) {
                categoryCopy.notes = moveToEnd(newList, currentIndex);
                dispatch(updateCategory(categoryCopy));
            }
            return;
        }
    };

    const handleBellPress = () => {
        if (dontForgetMe) {
            const config: DontForgetMeConfig = {
                noteID: note.id,
                subCategoryID: subCategory ? subCategory.id : "",
                categoryID: category.id,
                date: "",
            };
            dispatch(addDontForgetMe(config));

            const newOverlay: MenuOverlay = {
                isShowing: true,
                menuType: "note",
                menuData: {
                    noteID: note.id,
                    categoryID: categoryID ? categoryID : "",
                    subCategoryID: subCategoryID ? subCategoryID : "",
                    categoryIndex: parentCategoryIndex,
                    subCategoryIndex: subCategoryIndex !== undefined ? subCategoryIndex : null,
                    noteIndex: index,
                    isSearchTile: isSearchTile,
                    subMenu: "dontForgetMe",
                },
            };
            dispatch(updateMenuOverlay(newOverlay));

            return;
        }
    };

    return (
        <View onLayout={handleCategoryLayout} style={isLastNote && noteStyles.bottomBorder}>
            <View
                style={[
                    addBottomRadius() && noteStyles.bottomBorder,
                    noteStyles.noteTile,
                    moving === noteID && noteStyles.noteTileSelected,
                    isSelected && noteStyles.noteTileSelected,
                ]}
            >
                {dontForgetMe && (
                    <View style={categoryStyles.dontForgetMeContainer}>
                        <TouchableOpacity onPress={handleBellPress}>
                            <Ionicons name="notifications-outline" style={categoryStyles.dontForgetMeBell} />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={noteStyles.noteContainer}>
                    <TouchableOpacity onPress={handleImagePress} onLongPress={handleLongPress}>
                        {note.imageURI && <Image source={{ uri: note.imageURI }} style={{ height: 150, width: 150 }} />}
                    </TouchableOpacity>
                    {noteEditMode && (
                        <TextInput
                            multiline
                            style={[
                                noteStyles.noteText,
                                noteStyles.noteTextFocused,
                                note.priority === "high" && noteStyles.highPriority,
                            ]}
                            onChangeText={handleNoteChange}
                            onBlur={handleNoteBlur}
                            value={note.note}
                            autoFocus
                        />
                    )}
                    {!noteEditMode && (
                        <TouchableWithoutFeedback onPress={handleTouchNote} onLongPress={handleLongPress}>
                            <Text style={[noteStyles.noteText, note.priority === "high" && noteStyles.highPriority]}>
                                {note.isSecureNote && (
                                    <FontAwesome name="lock" style={noteStyles.padlock}></FontAwesome>
                                )}
                                {note.isSecureNote && "  "}
                                {note.note}
                            </Text>
                        </TouchableWithoutFeedback>
                    )}
                </View>
                <View style={noteStyles.tileIconsContainer}>
                    {noteEditMode && (
                        <TouchableOpacity onPress={handleCameraPress}>
                            <FontAwesome name="camera" style={[noteStyles.icons, noteStyles.noteEllipsis]} />
                        </TouchableOpacity>
                    )}
                    {moving === noteID ? (
                        <>
                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity onPress={handleUpToTopPress}>
                                    <MaterialIcons
                                        name="keyboard-double-arrow-up"
                                        style={[noteStyles.noteText, noteStyles.moveArrowsSmall]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleUpPress}>
                                    <Entypo name="arrow-bold-up" style={[noteStyles.noteText, noteStyles.moveArrows]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDownPress}>
                                    <Entypo
                                        name="arrow-bold-down"
                                        style={[noteStyles.noteText, noteStyles.moveArrows]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDownToBottomPress}>
                                    <MaterialIcons
                                        name="keyboard-double-arrow-down"
                                        style={[noteStyles.noteText, noteStyles.moveArrowsSmall]}
                                    />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity onPress={handleCheckboxPress}>
                                {note.completed && (
                                    <Text style={[noteStyles.icons, noteStyles.completedCheckbox]}>&#x2705;</Text>
                                )}
                                {!note.completed && (
                                    <Text style={[noteStyles.icons, noteStyles.notCompletedCheckbox]}>&#x26AA;</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleMenuPress}>
                                <FontAwesome name="ellipsis-v" style={[noteStyles.icons, noteStyles.noteEllipsis]} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                {<InsertNote subCategoryID={subCategoryID} categoryID={categoryID} index={index} />}
            </View>
            {isShowingImage && (
                <ImageModal
                    height={100}
                    width={100}
                    isShowingImage={isShowingImage}
                    setIsShowingImage={setIsShowingImage}
                    imageURI={note.imageURI}
                    note={note}
                />
            )}
        </View>
    );
};

interface Props {
    subCategoryID?: string;
    categoryID: string;
    index: number;
}

// InsertNote is an invisible symbol at the bottom left of each note tile to allow a clickable space
// for inserting notes into specific places in the note list.
const InsertNote: React.FC<Props> = ({ subCategoryID, categoryID, index }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleAddNoteToBottom = () => {
        dispatch(updateMenuOverlay(getEmptyOverlay()));

        // slight issue with secure notes, in that it messes the insertion index up.
        // so really, need to find the true index of the note we're adding below... so look up the category, find the index in notes where the ref.id matches this id
        // and use that index as insertion position.
        const newNoteData: NewNoteData = {
            categoryID: categoryID,
            subCategoryID: subCategoryID ? subCategoryID : "",
            imageURI: "",
            noteInsertIndex: index + 1,
        };
        dispatch(createNewNote(newNoteData));
    };
    return (
        <View style={noteStyles.addToBottomContainer}>
            <TouchableOpacity onLongPress={handleAddNoteToBottom}>
                <Text style={noteStyles.addToBottomText}></Text>
            </TouchableOpacity>
        </View>
    );
};

export default NoteTile;
