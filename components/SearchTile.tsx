import React, { useEffect, useRef, useState } from "react";
import { BackHandler, TouchableWithoutFeedback, View, Text, FlatList } from "react-native";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";

import { RootState } from "../redux/store/store";
import { useSelector } from "react-redux";
import { Note } from "../types";
import NoteTile from "./NoteTile";

interface TileProps {
    setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
    searchText: string;
    focusInput: () => void;
}

const SearchCategoryTile: React.FC<TileProps> = ({ searchText, setIsSearch, focusInput }) => {
    const notes = useSelector((state: RootState) => state.memory.notes);

    const [searchResults, setSearchResults] = useState<Note[]>([]);
    useEffect(() => {
        const matchingNotes = searchNotes(searchText);
        setSearchResults([...matchingNotes]);
        console.log(matchingNotes.length);
        console.log(matchingNotes);
    }, [searchText]);

    // back button closes closes search rather than normal behaviour
    useEffect(() => {
        const backAction = () => {
            setIsSearch(false);
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove(); // Cleanup the event listener
    }, []);

    const searchNotes = (searchTerm: string) => {
        const matchingNotes = [];
        const searchTermLower = searchTerm.toLowerCase();
        // Iterate through each note in the map
        for (const id in notes) {
            const note = notes[id];

            const noteTextLower = note.note.toLowerCase();
            // Check if the note's text contains the search term
            if (noteTextLower.includes(searchTermLower)) {
                matchingNotes.push(note);
            }
        }

        return matchingNotes;
    };

    const renderSearchResult = ({ item, index }: { item: Note; index: number }) => (
        <NoteTile
            index={Number(index)}
            parentCategoryIndex={-1}
            noteID={item.id}
            categoryID={""}
            subCategoryID={""}
            isLastCategory={false} // technically yes but dont need
            isLastNote={index === searchResults.length - 1}
            key={item.id}
            subCategoryIndex={10000}
        />
    );

    const inputRef = useRef(null);

    const handleSearchTilePress = () => {
        // set focus back to searchinput
        focusInput();
    };
    return (
        <>
            <TouchableWithoutFeedback onPress={handleSearchTilePress}>
                <View style={[categoryStyles.categoryTile, categoryStyles.categoryTileFirst]}>
                    <View style={categoryStyles.categoryTextContainer}>
                        <Text style={categoryStyles.categoryText} adjustsFontSizeToFit={true} numberOfLines={1}>
                            {searchText}
                        </Text>
                    </View>
                    <View style={categoryStyles.tileIconsContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                setIsSearch(false);
                            }}
                        >
                            <Ionicons
                                name="return-up-back"
                                style={[categoryStyles.binocularsIconText, categoryStyles.icons]}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <FlatList
                removeClippedSubviews={false}
                style={categoryStyles.categoryListContainer}
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(note) => note.id}
            />
        </>
    );
};

export default SearchCategoryTile;
