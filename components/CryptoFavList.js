import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  AsyncStorage,
 } from 'react-native'
import { SearchBar, List, ListItem } from 'react-native-elements'
import RNShakeEvent from 'react-native-shake-event'

const FAVORITEDBKEY = 'favorites';


export default class CryptoFavList extends Component {
  static navigationOptions = {
    title: 'Favourites'
  }

  state = {
    favCryptoList:null,
    filterFavSearch:[],
    isZeroFavList:false
  }

  componentDidMount() {
    this._getFavoritedCoins()
    this._handleShakeEvent()
  }

  componentWillUnmount() {
    RNShakeEvent.removeEventListener('shake');
  }

  _handleShakeEvent = () => {
    RNShakeEvent.addEventListener('shake', () => {
      this.props.navigation.navigate('Home')
    })
  }


  async _getFavoritedCoins() {
    const favoritedCoinsJson = await AsyncStorage.getItem(FAVORITEDBKEY);
    const favoriteData = JSON.parse(favoritedCoinsJson);
    favoriteData.length == 0 ? this.setState({isZeroFavList: true}) : this.setState({favCryptoList: favoriteData })
  }


  _searchFavCrypto = (text) => {
    this.setState(prev => ({filterFavSearch:text, favCryptoList: prev.favCryptoList}))
  }


  _renderHeader = () => {
    return <SearchBar
            round
            onChangeText={this._searchFavCrypto}
            placeholder='Type Here...' />
   }


   _renderFavRow = ({ item }) => {
     const url = `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`
     return (
       <ListItem
         roundAvatar
         title={item.name}
         subtitle={item.symbol}
         avatar={{uri:url}}
         onPress={() => this.props.navigation.navigate('CryptoDetails', { cryptoObj: item , cryptoImg: url})}
       />
     )
   }


   _renderFavList = () => {
     this._getFavoritedCoins()
     let renderedList = this.state.favCryptoList;
      if( !(Array.isArray(renderedList)) ) {
          return (<Text>Wrong format!</Text>)
      }

    if (this.state.filterFavSearch.length > 0) {
       renderedList = renderedList.filter(crypto => {
           return crypto.name.includes(this.state.filterFavSearch)
       })
     }

     return (
       <FlatList
         data={renderedList}
         keyExtractor={(item) => item.id.toString()}
         ListHeaderComponent={this._renderHeader}
         renderItem={this._renderFavRow}>
       </FlatList>)
   }


  render() {

    if (this.state.isZeroFavList) {
      return  <Text style={styles.loadingText}>Nothing in the list...</Text>
    }

    return(
      <View style={styles.container}>
          <List containerStyle={styles.listStyle}>
            { this.state.favCryptoList ? this._renderFavList() : <Text style={styles.loadingText}>Loading...</Text> }
          </List>
      </View>
    )
  }
}


const styles = {
    container: {
      flex:1,
      backgroundColor: 'rgb(19, 21, 25)',
    },
    listStyle: {
      backgroundColor: 'rgb(19, 21, 25)',
      marginTop: 0,
    },
    loadingText: {
      marginTop: 100,
      fontSize: 40,
      color: 'grey',
      alignSelf: 'center'
    },
    infoContainer: {
     flex: 1,
     backgroundColor: 'black',
   },
   infoContainer__items: {
     alignItems: 'center',
     padding: 20,
     marginTop: 50,
   },
   infoContainer__title: {
     color: 'white',
     fontSize: 35,
     marginTop: 5,
   },
   infoContainer__price: {
     color: 'white',
     fontSize: 20,
   },
   valuesContainer__values: {
     color: 'white',
     marginTop: 5,
   },
   favoriteButton: {
     marginTop: 25,
     padding: 15,
     borderWidth: 1,
     borderColor: 'white',
     borderRadius: 25,
   },
   favoriteButton__text: {
     color: 'white',
     fontSize: 18,
     paddingLeft: 5,
     paddingRight: 5,
   }
  }
