import React, { useEffect, useRef, useState } from "react";
import { BackHandler, TouchableWithoutFeedback, View, Text, FlatList } from "react-native";
import categoryStyles from "../styles/categoryStyles";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { RootState } from "../redux/store/store";
import { useSelector } from "react-redux";
import NoteTile from "./NoteTile";
import { AppDispatch } from "../redux/store/store";
import { getEmptyOverlay } from "../utilFuncs/utilFuncs";
import { updateMenuOverlay } from "../redux/slice";

interface TileProps {
    setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
    searchText: string;
    focusInput: () => void;
}

const SearchCategoryTile: React.FC<TileProps> = ({ searchText, setIsSearch, focusInput }) => {
    const notes = useSelector((state: RootState) => state.memory.notes);
    const showSecure = useSelector((state: RootState) => state.memory.canShowSecure.homeScreen);
    const dispatch = useDispatch<AppDispatch>();

    // back button closes search rather than normal behaviour
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
        if (searchTerm.length > 2) {
            for (const id in notes) {
                const note = notes[id];

                const noteTextLower = note.note.toLowerCase();
                // Check if the note's text contains the search term
                if (noteTextLower.includes(searchTermLower)) {
                    if (!note.isSecureNote || showSecure) {
                        matchingNotes.push(note.id);
                    }
                }
            }
        }

        return matchingNotes;
    };

    const searchResults = searchNotes(searchText);

    // just need dummy setState function to pass into NoteTile
    const [dummy, setDummy] = useState("");
    const renderSearchResult = ({ item, index }: { item: string; index: number }) => (
        <NoteTile
            index={Number(index)}
            parentCategoryIndex={-1}
            noteID={item}
            categoryID={""}
            subCategoryID={""}
            isLastCategory={false} // technically yes but dont need
            isLastNote={index === searchResults.length - 1}
            key={item}
            subCategoryIndex={10000}
            isSearchTile={true}
            moving={""}
            setMoving={setDummy}
        />
    );

    const handleBackPress = () => {
        dispatch(updateMenuOverlay(getEmptyOverlay()));
        setIsSearch(false);
    };

    const inputRef = useRef(null);

    const handleSearchTilePress = () => {
        // set focus back to searchinput
        dispatch(updateMenuOverlay(getEmptyOverlay()));
        focusInput();
    };
    return (
        <>
            <TouchableWithoutFeedback onPress={handleSearchTilePress}>
                <View
                    style={[
                        categoryStyles.categoryTile,
                        categoryStyles.categoryTileFirst,
                        categoryStyles.topRadius,
                        searchResults.length === 0 && categoryStyles.bottomRadius,
                    ]}
                >
                    <View style={categoryStyles.categoryTextContainer}>
                        {searchText ? (
                            <Text style={categoryStyles.categoryText} adjustsFontSizeToFit={true} numberOfLines={1}>
                                <FontAwesome5
                                    name="binoculars"
                                    style={[categoryStyles.binocularCategoryText, categoryStyles.icons]}
                                />
                                {"   "}
                                {searchText}
                            </Text>
                        ) : (
                            <Text
                                style={categoryStyles.searchTilePlaceholderText}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                <FontAwesome5
                                    name="binoculars"
                                    style={[categoryStyles.binocularNoteText, categoryStyles.icons]}
                                />
                                {"    "}
                                Start typing to filter results...
                            </Text>
                        )}
                    </View>
                    <View style={categoryStyles.tileIconsContainer}>
                        <TouchableWithoutFeedback onPress={handleBackPress}>
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
                keyExtractor={(note) => note}
            />
        </>
    );
};

export default SearchCategoryTile;
