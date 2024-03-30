import { GestureResponderEvent, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Note, SubCategory, Category } from "../types";
import { useDispatch } from "react-redux";
import { addNewNoteToNotes, updateNote, updateCategory, updateSubCategory } from "../redux/slice";
import { useEffect, useRef, useState } from "react";
import { getRandomID } from "../memoryfunctions/memoryfunctions";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import { AppDispatch } from "../redux/store/store";

// TODO: COMBINE NETNOTETIL AND NOTETILE AS THEYRE BASICALLY THE SAME THING.
/// just need a prop to say isNewNoteTile for the diff behaviour
interface TileProps {
    subCategory?: SubCategory;
    category?: Category;
    isLastCategory: boolean;
    isLastSubCategory?: boolean;
    setAddingNewNote: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewNoteTile: React.FC<TileProps> = ({
    subCategory,
    setAddingNewNote,
    category,
    isLastCategory,
    isLastSubCategory,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const textInputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [newNote, setNewNote] = useState("");
    const notes = useSelector((state: RootState) => state.memory.notes);
    let emptyCategory = false;
    if (category) {
        emptyCategory = category.subCategories.length === 0 && category.notes.length === 0;
    }
    if (subCategory) {
        emptyCategory = subCategory.notes.length === 0;
    }

    const addBottomTileMargin = () => {
        if (!isLastCategory) {
            return false;
        }

        if (subCategory && !isLastSubCategory) {
            return false;
        }

        return emptyCategory;
    };

    const handleChange = (text: string) => {
        setNewNote(text);
    };

    const handleBlur = () => {
        setIsFocused(false);

        if (newNote === "") {
            setAddingNewNote(false);

            return;
        }

        const noteToAdd: Note = {
            id: getRandomID(),
            note: newNote,
            additionalInfo: "",
            dateAdded: "",
            dateUpdated: "",
            priority: "normal",
            completed: false,
            imageURI: "",
        };
        dispatch(addNewNoteToNotes(noteToAdd));

        if (category) {
            const categoryNotes = [...category.notes];
            categoryNotes.unshift(noteToAdd.id);
            dispatch(updateCategory({ ...category, notes: categoryNotes }));
        }

        if (subCategory) {
            const subCategoryNotes = [...subCategory.notes];
            subCategoryNotes.unshift(noteToAdd.id);
            dispatch(updateSubCategory({ ...subCategory, notes: subCategoryNotes }));
        }

        setAddingNewNote(false);
    };

    const handleNoteFocus = () => {
        setIsFocused(true);
    };

    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }, []);

    return (
        <View
            style={[
                noteStyles.noteTile,
                addBottomTileMargin() && noteStyles.lastMargin,
                emptyCategory && noteStyles.bottomBorder,
            ]}
        >
            <View style={noteStyles.noteContainer}>
                <TextInput
                    multiline
                    style={[noteStyles.noteText, isFocused && noteStyles.noteTextFocused]}
                    onFocus={handleNoteFocus}
                    onChangeText={(text) => handleChange(text)}
                    onBlur={handleBlur}
                    value={newNote}
                    ref={textInputRef}
                />
            </View>
            <View style={noteStyles.tileIconsContainer}>
                <Text style={[noteStyles.icons, noteStyles.notCompletedCheckbox]}>&#x26AA;</Text>
                <FontAwesome name="ellipsis-v" style={[noteStyles.icons, noteStyles.noteEllipsis]} />
            </View>
        </View>
    );
};

export default NewNoteTile;
