import { Provider } from "react-redux";
import HomeScreen from "./components/HomeScreen";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store/store";
import { Text } from "react-native";

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
                <HomeScreen />
            </PersistGate>
        </Provider>
    );
};

export default App;
