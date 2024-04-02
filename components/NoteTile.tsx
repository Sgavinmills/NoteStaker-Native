import {
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    GestureResponderEvent,
    TouchableWithoutFeedback,
} from "react-native";
import noteStyles from "../styles/noteStyles";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Category, MenuOverlay, Note, SubCategory, CatHeight, SubHeight } from "../types";
import { useDispatch } from "react-redux";
import {
    addNewNoteToNotes,
    deleteNoteFromAllCategories,
    updateCategory,
    updateMenuOverlay,
    updateNote,
    updateSubCategory,
} from "../redux/slice";
import { useEffect, useRef, useState } from "react";
import ImageModal from "./ImageModal";
import { AppDispatch } from "../redux/store/store";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { getRandomID } from "../memoryfunctions/memoryfunctions";

interface TileProps {
    note: Note;
    isLastCategory: boolean;
    isLastSubCategory?: boolean;
    isLastNote: boolean;
    isInSubCategory: boolean; // prob dont need this as well as ID, but leaving for now
    subCategory?: SubCategory;
    category: Category;
    index: number;
    subCategoryIndex?: number;
    parentCategoryIndex: number;
    heightData: CatHeight[];
    setHeightData: React.Dispatch<React.SetStateAction<CatHeight[]>>;
}

const NoteTile: React.FC<TileProps> = ({
    note,
    isLastCategory,
    isInSubCategory, //p prob wont need with passing the IDs too
    isLastNote,
    isLastSubCategory,
    category,
    subCategory,
    index,
    subCategoryIndex,
    parentCategoryIndex,
    heightData,
    setHeightData,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const menuOverlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const [noteEditMode, setNoteEditMode] = useState(note.isNewNote);

    const [isShowingImage, setIsShowingImage] = useState(false);
    const handleNoteChange = (text: string) => {
        const noteCopy = { ...note, note: text };
        if (noteCopy.isNewNote) {
            noteCopy.isNewNote = false;
        }
        dispatch(updateNote(noteCopy));
    };

    const menuOverlayRef = useRef(menuOverlay);

    // allows cleanup method to access current state
    useEffect(() => {
        menuOverlayRef.current = menuOverlay;
    }, [menuOverlay]);

    // this cleanup method closes the menu overlay if the tile its related to gets disposed of. Originally was for if the category got closed (which is no longer possible)
    // and then for when removing from category, but we've now taken that out. GUnna leave code in for now incase it does need to be actioned but atm doesnt do anything.
    useEffect(() => {
        return () => {
            // cleanup method. Turns off arrow overlay if connected to this note
            if (menuOverlayRef.current && menuOverlayRef.current.menuData.noteID === note.id) {
                const closeOverlay = subCategory?.id
                    ? menuOverlayRef.current.menuData.categoryID === category.id &&
                      menuOverlayRef.current.menuData.subCategoryID === subCategory.id
                    : menuOverlayRef.current.menuData.categoryID === category.id;
                if (closeOverlay) {
                    // dispatch(updateMenuOverlay(getEmptyOverlay())); // or actually, make turnoffmeuoverlay reducer that just sets all menu data to empty
                }
            }
        };
    }, []);

    const handleNoteBlur = () => {
        if (note.note === "" && note.imageURI === "") {
            const id = note.id;
            dispatch(deleteNoteFromAllCategories(id));
            // should give option to delete from just the category or sub category
            //   " you are about to remove note from all cats and sub cats, would you prefer to just delete from this one?"
        }

        if (note.isNewNote) {
            const noteCopy = { ...note, isNewNote: false };
            dispatch(updateNote(noteCopy));
        }
        setNoteEditMode(false);
    };

    const handleMenuPress = (event: GestureResponderEvent) => {
        if (menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }
        const newOverlay: MenuOverlay = {
            isShowing: true,
            menuType: "note",
            menuData: {
                noteID: note.id,
                categoryID: category ? category.id : "",
                subCategoryID: subCategory ? subCategory.id : "",
                categoryIndex: parentCategoryIndex,
                subCategoryIndex: subCategoryIndex !== undefined ? subCategoryIndex : null,
                noteIndex: index,
            },
        };
        dispatch(updateMenuOverlay(newOverlay));
    };

    const handleImagePress = () => {
        if (menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }

        setIsShowingImage(true);
    };

    const addBottomTileMargin = () => {
        if (!isLastCategory) {
            return false;
        }

        if (!isInSubCategory) {
            return isLastNote;
        }
        return isLastSubCategory && isLastNote;
    };

    const handleCheckboxPress = () => {
        const noteCopy = { ...note };
        noteCopy.completed = !noteCopy.completed;
        dispatch(updateNote(noteCopy));
    };

    const handleTouchNote = () => {
        if (menuOverlay.isShowing) {
            dispatch(updateMenuOverlay(getEmptyOverlay()));
            return;
        }
        setNoteEditMode(true);
    };

    const tileHasMenuOpen = () => {
        if (menuOverlay.isShowing && menuOverlay.menuType === "note" && menuOverlay.menuData.noteID === note.id) {
            if (menuOverlay.menuData.subCategoryID && subCategory) {
                return menuOverlay.menuData.subCategoryID === subCategory.id;
            }

            return menuOverlay.menuData.categoryID === category.id;
        }

        return false;
    };

    const handleCategoryLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;

        setHeightData((prevState: CatHeight[]) => {
            const newState = [...prevState];

            const newCatHeight = { ...newState[parentCategoryIndex] };
            if (subCategoryIndex !== undefined && subCategoryIndex >= 0) {
                const newSubCatHeight = { ...newCatHeight.subHeights[subCategoryIndex] };
                newSubCatHeight.noteHeights[index] = height;
                newCatHeight.subHeights[subCategoryIndex] = newSubCatHeight;

                newState[parentCategoryIndex] = newCatHeight;

                return newState;
            } else {
                const newNoteHeights = [...newCatHeight.noteHeights];
                newNoteHeights[index] = height;
                newCatHeight.noteHeights = newNoteHeights;
                newState[parentCategoryIndex] = newCatHeight;
                return newState;
            }
        });
    };

    return (
        <View
            onLayout={handleCategoryLayout}
            style={[addBottomTileMargin() && noteStyles.lastMargin, isLastNote && noteStyles.bottomBorder]}
        >
            <View
                style={[
                    addBottomTileMargin() && noteStyles.lastMargin,
                    isLastNote && noteStyles.bottomBorder,
                    noteStyles.noteTile,
                    tileHasMenuOpen() && categoryStyles.categoryTileSelected,
                ]}
            >
                <View style={noteStyles.noteContainer}>
                    <TouchableOpacity onPress={handleImagePress}>
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
                        <TouchableWithoutFeedback onPress={handleTouchNote} onLongPress={handleMenuPress}>
                            <Text style={[noteStyles.noteText, note.priority === "high" && noteStyles.highPriority]}>
                                {note.note}
                            </Text>
                        </TouchableWithoutFeedback>
                    )}
                </View>
                <View style={noteStyles.tileIconsContainer}>
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
                </View>
                {<InsertNote subCategory={subCategory} category={category} index={index} />}
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
    subCategory?: SubCategory;
    category?: Category;
    index: number;
}

// InsertNote is an invisible symbol at the bottom left of each note tile to allow a clickable space
// for inserting notes into specific places in the note list.
const InsertNote: React.FC<Props> = ({ subCategory, category, index }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleAddNoteToBottom = () => {
        const noteToAdd: Note = {
            id: getRandomID(),
            note: "",
            additionalInfo: "",
            dateAdded: "",
            dateUpdated: "",
            priority: "normal",
            completed: false,
            imageURI: "",
            isNewNote: true,
        };
        dispatch(addNewNoteToNotes(noteToAdd));

        if (subCategory) {
            const subCategoryNotes = [...subCategory.notes];
            subCategoryNotes.splice(index + 1, 0, noteToAdd.id);
            dispatch(updateSubCategory({ ...subCategory, notes: subCategoryNotes }));
            return;
        }

        if (category) {
            const categoryNotes = [...category.notes];
            categoryNotes.splice(index + 1, 0, noteToAdd.id);

            dispatch(updateCategory({ ...category, notes: categoryNotes }));
        }
    };
    return (
        <View style={noteStyles.addToBottomContainer}>
            <TouchableWithoutFeedback onPress={handleAddNoteToBottom}>
                <Text style={noteStyles.addToBottomText}>+</Text>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default NoteTile;
