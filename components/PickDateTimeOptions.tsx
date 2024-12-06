import React from "react";
import { View, Text, Button } from "react-native";
import dateTimeModalStyles from "../styles/dateTimeModalStyles";

interface TileProps {
    setPickDateTimeModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleOptionPress: (reminderTime?: Date) => void;
    modalType: string;
}

// TODO - MAKE THIS CONFIGURABLE SO WE ONLY SEE THE OPTIONS WE WANT

const PickDateTimeOptions: React.FC<TileProps> = ({ modalType, handleOptionPress, setPickDateTimeModalVisible }) => {
    const handleSnoozeForOption = (hours: number) => {
        const currentTime = new Date();
        const timeInMilliseconds = 60 * 60 * 1000 * hours;
        const reminderTime = new Date(currentTime.getTime() + timeInMilliseconds);

        handleOptionPress(reminderTime);
    };

    // time is hh:mm
    // days is how many days in future (ie tmrw = 1, 1 week = 7, etc)
    const handleTimeInFutureOption = (time: string, days: number) => {
        const [hours, minutes] = time.split(":").map(Number);

        const reminderTime = new Date();

        if (days > 0) {
            reminderTime.setDate(reminderTime.getDate() + days);
        }

        reminderTime.setHours(hours, minutes, 0, 0);

        handleOptionPress(reminderTime);
    };

    const handleCustom = () => {
        handleOptionPress();
    };

    const enableTime = (hour: number) => {
        if (hour < 0 || hour > 23) {
            return;
        }

        const now = new Date();
        const currentHour = now.getHours();

        return currentHour >= hour;
    };

    return (
        <>
            <View>
                <Text style={dateTimeModalStyles.tabContainerHeader}>Remind in: </Text>
                <View style={dateTimeModalStyles.snoozeForTabContainer}>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        {/* // these are useful for dev work */}
                        {/* <Button
                            title="10 seconds"
                            onPress={() => {
                                handleSnoozeForOption(10 / 3600);
                            }}
                        />
                        <Button
                            title="1 minute"
                            onPress={() => {
                                handleSnoozeForOption(60 / 3600);
                            }}
                        /> */}
                        <Button
                            title="10 mins"
                            onPress={() => {
                                handleSnoozeForOption(0.1666);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="30 mins"
                            onPress={() => {
                                handleSnoozeForOption(0.5);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="1 hour"
                            onPress={() => {
                                handleSnoozeForOption(1);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="2 hours"
                            onPress={() => {
                                handleSnoozeForOption(2);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="4 hours"
                            onPress={() => {
                                handleSnoozeForOption(4);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="8 hours"
                            onPress={() => {
                                handleSnoozeForOption(8);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="12 hours"
                            onPress={() => {
                                handleSnoozeForOption(12);
                            }}
                        />
                    </View>
                </View>
            </View>
            <View>
                <Text style={dateTimeModalStyles.tabContainerHeader}>Time today: </Text>

                <View style={dateTimeModalStyles.todayTabContainer}>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(10)}
                            title="10:00"
                            onPress={() => {
                                handleTimeInFutureOption("10:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(11)}
                            title="11:00"
                            onPress={() => {
                                handleTimeInFutureOption("11:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(12)}
                            title="12:00"
                            onPress={() => {
                                handleTimeInFutureOption("12:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(13)}
                            title="13:00"
                            onPress={() => {
                                handleTimeInFutureOption("13:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(14)}
                            title="14:00"
                            onPress={() => {
                                handleTimeInFutureOption("14:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(15)}
                            title="15:00"
                            onPress={() => {
                                handleTimeInFutureOption("15:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(16)}
                            title="16:00"
                            onPress={() => {
                                handleTimeInFutureOption("16:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(17)}
                            title="17:00"
                            onPress={() => {
                                handleTimeInFutureOption("17:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(18)}
                            title="18:00"
                            onPress={() => {
                                handleTimeInFutureOption("18:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(19)}
                            title="19:00"
                            onPress={() => {
                                handleTimeInFutureOption("19:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(20)}
                            title="20:00"
                            onPress={() => {
                                handleTimeInFutureOption("20:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(21)}
                            title="21:00"
                            onPress={() => {
                                handleTimeInFutureOption("21:00", 0);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            disabled={enableTime(22)}
                            title="22:00"
                            onPress={() => {
                                handleTimeInFutureOption("22:00", 0);
                            }}
                        />
                    </View>
                </View>
            </View>
            <Text style={dateTimeModalStyles.tabContainerHeader}>Other: </Text>

            <View style={dateTimeModalStyles.tomorrowTabContainer}>
                <View style={dateTimeModalStyles.buttonContainer}>
                    <Button
                        // style={dateTimeModalStyles.optionTab}
                        title="Tomorrow morning (10:00)"
                        onPress={() => {
                            handleTimeInFutureOption("10:00", 1);
                        }}
                    />
                </View>
                <View style={dateTimeModalStyles.buttonContainer}>
                    <Button
                        // style={dateTimeModalStyles.optionTab}
                        title="Tomorrow afternoon (14:00)"
                        onPress={() => {
                            handleTimeInFutureOption("14:00", 1);
                        }}
                    />
                </View>
                <View style={dateTimeModalStyles.buttonContainer}>
                    <Button
                        // style={dateTimeModalStyles.optionTab}
                        title="Tomorrow evening (19:00)"
                        onPress={() => {
                            handleTimeInFutureOption("19:00", 1);
                        }}
                    />
                </View>
            </View>

            <View style={dateTimeModalStyles.futureTabContainer}>
                <View style={dateTimeModalStyles.twoButtonContainer}>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="2 days (10:00)"
                            onPress={() => {
                                handleTimeInFutureOption("10:00", 2);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="2 days (14:00)"
                            onPress={() => {
                                handleTimeInFutureOption("14:00", 2);
                            }}
                        />
                    </View>
                </View>
                <View style={dateTimeModalStyles.twoButtonContainer}>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="1 week (10:00)"
                            onPress={() => {
                                handleTimeInFutureOption("10:00", 7);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="1 week (14:00)"
                            onPress={() => {
                                handleTimeInFutureOption("14:00", 7);
                            }}
                        />
                    </View>
                </View>
                <View style={dateTimeModalStyles.twoButtonContainer}>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="2 weeks (10:00)"
                            onPress={() => {
                                handleTimeInFutureOption("10:00", 14);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="2 weeks (14:00)"
                            onPress={() => {
                                handleTimeInFutureOption("14:00", 14);
                            }}
                        />
                    </View>
                </View>
                <View style={dateTimeModalStyles.twoButtonContainer}>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="4 weeks (10:00)"
                            onPress={() => {
                                handleTimeInFutureOption("10:00", 28);
                            }}
                        />
                    </View>
                    <View style={dateTimeModalStyles.buttonContainer}>
                        <Button
                            title="4 weeks (14:00)"
                            onPress={() => {
                                handleTimeInFutureOption("14:00", 28);
                            }}
                        />
                    </View>
                </View>
            </View>

            <View style={[dateTimeModalStyles.buttonContainer, dateTimeModalStyles.tomorrowTabContainer]}>
                <Button
                    title="Custom date/time"
                    onPress={() => {
                        handleCustom();
                    }}
                />
            </View>

            {modalType === "dontForgetMe" && (
                <View style={[dateTimeModalStyles.buttonContainer]}>
                    <Button
                        title="Cancel"
                        onPress={() => {
                            setPickDateTimeModalVisible(false);
                        }}
                    />
                </View>
            )}
        </>
    );
};

export default PickDateTimeOptions;
