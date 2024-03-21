import { StyleSheet, StatusBar } from "react-native";
import theme from "./constants";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: theme.colors.blackBackground,
    },
});

export default styles;
