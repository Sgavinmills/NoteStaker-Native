import { Provider } from "react-redux";
import store from "./redux/store/store";
import HomeScreen from "./components/HomeScreen";

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <HomeScreen />
        </Provider>
    );
};

export default App;
