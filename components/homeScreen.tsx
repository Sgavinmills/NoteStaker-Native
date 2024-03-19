import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import styles from '../styles'
import { RootState } from '../redux/reducers/reducers'
import CategoryTile from './categoryTile';
import { Category } from '../types';


const HomeScreen: React.FC = () => {
  const memory = useSelector((state: RootState) => state.memory);

    const renderCategory = ({ item }: { item: Category }) => (
        <CategoryTile category={item} />
      );
     

  return (
      <FlatList
        style={styles.container}
        data={memory.categories}
        renderItem={renderCategory}
        keyExtractor={(cat) => cat.name}
      />
  );
}


export default HomeScreen;