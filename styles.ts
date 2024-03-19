import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#010101',
    },

    subCategoryContainer: {
        padding: 0
        // flex: 1,
        // paddingTop: 40,
        // backgroundColor: 'yellow',
    },

    noteContainer: {
        // padding: 0,
        // borderColor: "red"
        // borderWidth: 0
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
        // borderWidth: 1,
        // borderColor: '#464646',
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
    
  });
  
  export default styles;