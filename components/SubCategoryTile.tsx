import { Text, View, TouchableWithoutFeedback, FlatList} from 'react-native';
import styles from '../styles/styles'
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { RootState } from '../redux/reducers/reducers'
import { useSelector } from 'react-redux';
import NoteTile from './NoteTile';
import { Note } from '../types';
import { hasCategory } from '../utilFuncs/utilFuncs';

interface TileProps {
    subCategoryName: string
    parentCategoryName: string
  }


  const SubCategoryTile: React.FC<TileProps> = ({subCategoryName, parentCategoryName}) => {
  const memory = useSelector((state: RootState) => state.memory);
  const notes = memory.notes

  const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const renderNote = ( {item}: { item: Note }) => (
      <NoteTile note={item}/>
      );

  return (
    <>
    <TouchableWithoutFeedback onPress={toggleExpansion}>
      <View style={styles.subCategoryTile}>
        <Text style={styles.subCategoryText}>↳ {subCategoryName}</Text>
        <View style={styles.tileIconsContainer}>
            <FontAwesome name="plus" style={[styles.categoryText, styles.icons]} />
            <FontAwesome name="caret-down" style={[styles.categoryText, styles.icons]} />
            <FontAwesome name="ellipsis-v" style={[styles.categoryText, styles.icons]} />
        </View>
      </View>

    </TouchableWithoutFeedback>
    {isExpanded && (
        <FlatList
            style={styles.noteContainer}
            data={notes.filter(note => {
              return hasCategory(note, parentCategoryName, subCategoryName)
            })}
            renderItem={renderNote}
            keyExtractor={(note) => note.id}
        />
    )}
    </>
  );
}


export default SubCategoryTile;