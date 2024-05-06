import { View, Text, TouchableOpacity } from "react-native";
import dontForgetMe from "../styles/dontForgetMe";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store/store";
import { DontForgetMeConfig } from "../types";
import { AppDispatch } from "../redux/store/store";
import { addDontForgetMe } from "../redux/slice";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
interface TileProps {
    setIsDontForgetMe: React.Dispatch<React.SetStateAction<boolean>>;
}

const DontForgetMeMenu: React.FC<TileProps> = ({ setIsDontForgetMe }) => {
    const dispatch = useDispatch<AppDispatch>();

    const overlay = useSelector((state: RootState) => state.memory.menuOverlay);
    const note = useSelector((state: RootState) => state.memory.notes[overlay.menuData.noteID]);
    const subCategory = useSelector((state: RootState) => state.memory.subCategories[overlay.menuData.subCategoryID]);
    const category = useSelector((state: RootState) => state.memory.categories[overlay.menuData.categoryID]);

    const handleOptionPress = (timeInHours: number) => {
        if (timeInHours > 0) {
            const currentTime = new Date();
            const timeInMilliseconds = 60 * 60 * 1000 * timeInHours;
            const reminderTime = new Date(currentTime.getTime() + timeInMilliseconds);
            const config: DontForgetMeConfig = {
                noteID: note.id,
                subCategoryID: subCategory ? subCategory.id : "",
                categoryID: category.id,
                date: reminderTime.toISOString(),
            };
            dispatch(addDontForgetMe(config));
            setIsDontForgetMe(false);
            return;
        }

        if (timeInHours === -1) {
            // custom time selector
            DateTimePickerAndroid.open({
                value: new Date(),
                onChange: onChangeDate,
                mode: "date",
                is24Hour: true,
            });
        }
    };

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
            const config: DontForgetMeConfig = {
                noteID: note.id,
                subCategoryID: subCategory ? subCategory.id : "",
                categoryID: category.id,
                date: selectedDate.toISOString(),
            };
            dispatch(addDontForgetMe(config));
            setIsDontForgetMe(false);
        }
    };

    return (
        <View style={dontForgetMe.container}>
            <Text style={dontForgetMe.text}>Remind me in:</Text>
            <View style={dontForgetMe.tabContainer}>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(0.1666);
                    }}
                >
                    <Text style={dontForgetMe.text}>10 minutes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(1);
                    }}
                >
                    <Text style={dontForgetMe.text}>1 hour</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(2);
                    }}
                >
                    <Text style={dontForgetMe.text}>2 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(4);
                    }}
                >
                    <Text style={dontForgetMe.text}>4 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(8);
                    }}
                >
                    <Text style={dontForgetMe.text}>8 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(12);
                    }}
                >
                    <Text style={dontForgetMe.text}>12 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(24);
                    }}
                >
                    <Text style={dontForgetMe.text}>24 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(48);
                    }}
                >
                    <Text style={dontForgetMe.text}>48 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(168);
                    }}
                >
                    <Text style={dontForgetMe.text}>1 week</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(336);
                    }}
                >
                    <Text style={dontForgetMe.text}>2 weeks</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(336);
                    }}
                >
                    <Text style={dontForgetMe.text}>4 weeks</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={dontForgetMe.tab}
                    onPress={() => {
                        handleOptionPress(-1);
                    }}
                >
                    <Text style={dontForgetMe.text}>Select date/time</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DontForgetMeMenu;
