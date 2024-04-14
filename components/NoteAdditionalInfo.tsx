import React from "react";
import { View, Text } from "react-native";
import additionalInfo from "../styles/additionalInfo";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

interface TileProps {}

const NoteAdditionalInfo: React.FC<TileProps> = ({}) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const note = useSelector((state: RootState) => state.memory.notes[overlay.menuData.noteID]);
    const categories = useSelector((state: RootState) => state.memory.categories);
    const subCategories = useSelector((state: RootState) => state.memory.subCategories);

    const getNoteLocations = (): string => {
        let locations = "";
        note.locations.forEach((loc) => {
            const catName = categories[loc[0]].name;
            if (loc[1] === "") {
                // main cat only
                if (locations.length !== 0) {
                    locations += `, `;
                }

                locations += `${catName}`;
            } else {
                const subCatName = subCategories[loc[1]].name;
                if (locations.length !== 0) {
                    locations += `, `;
                }
                locations += `${catName}->${subCatName}`;
            }
        });
        console.log(locations);
        return locations;
    };
    const noteLocations = getNoteLocations();
    return (
        <View style={additionalInfo.container}>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>ID: </Text>
                <Text style={additionalInfo.text}>{note.id}</Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Created: </Text>
                <Text style={additionalInfo.text}>{note.dateAdded && new Date(note.dateAdded).toLocaleString()}</Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Last updated: </Text>
                <Text style={additionalInfo.text}>
                    {note.dateUpdated && new Date(note.dateUpdated).toLocaleString()}
                </Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Created by: </Text>
                <Text style={additionalInfo.text}>{note.createdBy}</Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Last updated by: </Text>
                <Text style={additionalInfo.text}>{note.lastUpdatedBy}</Text>
            </View>
            <View style={additionalInfo.row}>
                <Text style={additionalInfo.text}>Is secure: </Text>
                <Text style={additionalInfo.text}>{note.isSecureNote ? "Yes" : "No"}</Text>
            </View>
            {noteLocations.length >= 30 ? (
                <Text style={additionalInfo.row}>
                    <Text style={additionalInfo.text}>Locations: </Text>
                    <Text style={additionalInfo.text} textBreakStrategy="balanced">
                        {noteLocations}
                    </Text>
                </Text>
            ) : (
                <View style={additionalInfo.row}>
                    <Text style={additionalInfo.text}>Locations: </Text>
                    <Text style={additionalInfo.text} textBreakStrategy="balanced">
                        {noteLocations}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default NoteAdditionalInfo;
