import React from "react";
import { View, Text } from "react-native";
import additionalInfo from "../styles/additionalInfo";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

interface TileProps {}

// AdjustingCategories is the menu view for moving notes between categories
const AdditionalInfo: React.FC<TileProps> = ({}) => {
    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const notes = useSelector((state: RootState) => state.memory.notes);

    const note = notes[overlay.menuData.noteID];

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
                <Text style={additionalInfo.text}>Image: </Text>
                <Text style={additionalInfo.text}>{note.imageURI}</Text>
            </View>
            <Text style={additionalInfo.text}>Secure note</Text>
        </View>
    );
};

export default AdditionalInfo;
