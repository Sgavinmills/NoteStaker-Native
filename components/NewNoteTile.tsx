import { Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import noteStyles from "../styles/noteStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Note, SubCategory, Category } from "../types";
import { useDispatch } from "react-redux";
import { addNote, deleteNote, updateNote } from "../redux/slice";
import { useEffect, useRef, useState } from "react";
import { getRandomID } from "../memoryfunctions/memoryfunctions";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";

interface TileProps {
    subCategory?: SubCategory;
    category?: Category;
    isLastCategory: boolean;
    setAddingNewNote: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewNoteTile: React.FC<TileProps> = ({ subCategory, setAddingNewNote, category, isLastCategory }) => {
    const dispatch = useDispatch();
    const textInputRef = useRef<TextInput>(null);
    const [newNote, setNewNote] = useState("");
    const notes = useSelector((state: RootState) => state.memory.notes);
    let addMargin = false;
    if (isLastCategory && category) {
        addMargin = !notes.some((note) => note.categories.includes(category.id));
    }

    const handleChange = (text: string) => {
        setNewNote(text);
    };

    const handleBlur = () => {
        if (newNote === "") {
            setAddingNewNote(false);

            return;
        }

        if (category) {
            const noteToAdd: Note = {
                id: getRandomID(),
                note: newNote,
                categories: [category.id],
                subCategories: [],
                additionalInfo: "",
                dateAdded: "",
                dateUpdated: "",
                priority: "normal",
                completed: false,
            };
            dispatch(addNote(noteToAdd));
        }

        if (subCategory) {
            const noteToAdd: Note = {
                id: getRandomID(),
                note: newNote,
                categories: [subCategory.parentCategory],
                subCategories: [subCategory.id],
                additionalInfo: "",
                dateAdded: "",
                dateUpdated: "",
                priority: "normal",
                completed: false,
            };
            dispatch(addNote(noteToAdd));
        }
        setAddingNewNote(false);
    };

    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }, []);

    return (
        <View style={[noteStyles.noteTile, addMargin && noteStyles.lastMargin]}>
            <TextInput
                style={[noteStyles.noteText]}
                onChangeText={(text) => handleChange(text)}
                onBlur={handleBlur}
                value={newNote}
                ref={textInputRef}
            />
            <View style={noteStyles.tileIconsContainer}>
                <Text style={noteStyles.icons}>&#x26AA;</Text>
                <FontAwesome name="ellipsis-v" style={[noteStyles.icons, noteStyles.noteEllipsis]} />
            </View>
        </View>
    );
};

export default NewNoteTile;
