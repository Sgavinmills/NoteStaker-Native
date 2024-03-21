import { StyleSheet, StatusBar } from 'react-native'
import theme from './constants'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: theme.colors.blackBackground
    },

    categoryListContainer: {
        flex: 1,
    },

    subCategoryContainer: {
        padding: 0
    },

    noteContainer: {
      borderWidth: 1,
      borderColor: theme.colors.tileBorder,
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

    noteTile: {
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

    noteText: {
        fontSize: 18,
        color: theme.colors.noteText,
      },

    tileIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },

    icons: {
        padding: 10,
    },

    noteEllipsis: {
        paddingTop: 13
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

    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.modalOverlayBackground,
        width:'100%',
        height: '100%',
    },

    modalTextInputContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },  

    newCategoryModalIconText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: theme.colors.categoryText,
        textAlign: 'right',
        marginRight: '8%',
    },

    modalCloseCategoryIconContainer: {
        width: "100%"
    },

    modalInput: {
        width: '65%',
        marginBottom: 20,
        marginTop: 40,
        padding: 10,
        backgroundColor: theme.colors.modalTextInputBackgroundColor,
        borderRadius: 5,
    },

    modalButtonContainer: {
        width: '65%',
    },

  });
  
  export default styles;