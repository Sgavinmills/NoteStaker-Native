import { Text, View } from 'react-native';
import styles from '../styles/styles'
import { FontAwesome } from '@expo/vector-icons';
import { Note } from '../types';

interface TileProps {
  note: Note
}

const NoteTile: React.FC<TileProps> = ({note}) => {

   
  return (
      <View style={styles.noteTile}>
        <Text style={styles.noteText}>{note.note}</Text>
        <View style={styles.tileIconsContainer}>
            {note.completed && (<Text style={[styles.noteText, styles.icons]}>&#x2705;</Text>)}
            {!note.completed && (<Text style={[styles.noteText, styles.icons]}>&#x26AA;</Text>)}
            <FontAwesome name="ellipsis-v" style={[styles.noteText, styles.icons, styles.noteEllipsis]} />
        </View>
      </View>
        
  );
}


export default NoteTile;