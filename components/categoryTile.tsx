import { Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import styles from '../styles'
import { FontAwesome } from '@expo/vector-icons';
import SubCategoryTile from './subCategoryTile';
import { Category } from '../types';

interface TileProps {
    category: Category
    index: number
  }


const CategoryTile: React.FC<TileProps> = ({category, index}) => {

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const renderSubCategory = ( {item}: { item: string }) => (
        <SubCategoryTile subCategoryName={item} parentCategoryName={category.name}/>
        );

  return (
    <>
    <TouchableWithoutFeedback onPress={toggleExpansion}>
      <View style={[styles.categoryTile, index === 0 && styles.categoryTileFirst]}>
        <Text style={styles.categoryText}>{category.name}</Text>
        <View style={styles.tileIconsContainer}>
            <FontAwesome name="plus" style={[styles.categoryText, styles.icons]} />
            <FontAwesome
                            name={isExpanded ? "caret-up" : "caret-down"}
                            style={[styles.categoryText, styles.icons]}
                        />
            <FontAwesome name="ellipsis-v" style={[styles.categoryText, styles.icons]} />
        </View>

      </View>
        
    </TouchableWithoutFeedback>
    {isExpanded && (
        <FlatList
            style={styles.subCategoryContainer}
            data={category.subCategories}
            renderItem={renderSubCategory}
            keyExtractor={(cat) => cat}
        />
    )}
      </>
  );
}


export default CategoryTile;