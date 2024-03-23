import { Provider } from "react-redux";
import store from "./redux/store/store";
import HomeScreen from "./components/HomeScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App: React.FC = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <HomeScreen />
            </Provider>
        </GestureHandlerRootView>
    );
};

export default App;
