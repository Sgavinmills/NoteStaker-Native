import { StyleSheet, StatusBar } from 'react-native'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#010101',
    },

    categoryListContainer: {
        flex: 1,
    },

    subCategoryContainer: {
        padding: 0
    },

    noteContainer: {
      borderWidth: 1,
      borderColor: '#464646',
    },
  
    categoryTile: {
      borderWidth: 1,
      borderColor: '#464646',
      backgroundColor: '#1e1e1e',
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
        borderColor: '#464646',
        backgroundColor: '#1e1e1e',
        textAlign: 'left',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },

    noteTile: {
        backgroundColor: '#1e1e1e',
        textAlign: 'left',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
  
    categoryText: {
      fontSize: 24,
      color: "#c6d6f0",
      fontWeight: 'bold',
    },

    subCategoryText: {
      fontSize: 20,
      color: "#c6d6f0"
    },

    noteText: {
        fontSize: 18,
        color: "#b4b4b4",
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
        color: "#c6d6f0",
        textAlign: 'right',
        marginRight: "8%",
        paddingTop: 5,
        paddingBottom: 5,
    },

    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
        color: "#c6d6f0",
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
        backgroundColor: 'white',
        borderRadius: 5,
    },

    modalButtonContainer: {
        width: '65%',
    },

  });
  
  export default styles;