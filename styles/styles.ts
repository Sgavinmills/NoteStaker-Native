import { StyleSheet, StatusBar } from "react-native";
import theme from "./constants";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: theme.colors.blackBackground,
    },

    logState: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default styles;
