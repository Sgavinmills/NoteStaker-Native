import { StyleSheet } from 'react-native'
import theme from './constants'

const catStyles = StyleSheet.create({
    categoryListContainer: {
        flex: 1,
    },

    subCategoryContainer: {
        padding: 0
    },

    categoryTile: {
        borderWidth: 1,
        borderColor: theme.colors.tileBorder,
        backgroundColor: theme.colors.tileBackground,
        textAlign: 'left',
        padding: 10,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
  
      categoryTileFirst: {
          marginTop: 0
      },


  
      subCategoryTile: {
          borderWidth: 1,
          borderColor: theme.colors.tileBorder,
          backgroundColor: theme.colors.tileBackground,
          textAlign: 'left',
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },

        categoryText: {
            fontSize: 24,
            color: theme.colors.categoryText,
            fontWeight: 'bold',
          },
      
          subCategoryText: {
            fontSize: 20,
            color: theme.colors.categoryText
          },

          newCategoryText: {
            fontSize: 30,
            fontWeight: 'bold',
            color: theme.colors.categoryText,
            textAlign: 'right',
            marginRight: "8%",
            paddingTop: 5,
            paddingBottom: 5,
        },

          tileIconsContainer: {
            flexDirection: 'row',
            justifyContent: 'center'
        },



        icons: {
            padding: 10,
        },
  
})

export default catStyles;
