import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  // Button,
  // TouchableOpacity,
  FlatList,
  ActivityIndicator,
  AsyncStorage,
 } from 'react-native';
 import _ from 'lodash'
import { SearchBar, List, ListItem } from 'react-native-elements'
import {createStackNavigator} from 'react-navigation'
import RNShakeEvent from 'react-native-shake-event'

const FAVORITEDBKEY = 'favorites';



class CryptoFavList extends Component {
  static navigationOptions = {
    title: 'Favourites'
  }

  state = {
    favCryptoList:null
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

  async _getFavoritedCoins(){
    const tempList = ['btc', 'xml', 'eth']
    await AsyncStorage.setItem(FAVORITEDBKEY, JSON.stringify(tempList))
    const favoritedCoinsJson = await AsyncStorage.getItem(FAVORITEDBKEY);
    const favoriteData = await JSON.parse(favoritedCoinsJson);
    await this.setState({favCryptoList: favoriteData });
  }


  render() {
    // when state.favCryptoList is ready, render the FlatList
    return(
      <View>
        { this.state.favCryptoList ? <Text>{this.state.favCryptoList.join(' ')}</Text> : <Text>Loading</Text>}
      </View>
    )
  }
}


class CryptoItem extends Component {
 static navigationOptions = {
   title: 'Info'
 }

 render() {
   const cryptoObj = this.props.navigation.getParam('cryptoObj')
   const cryptoImg =  this.props.navigation.getParam('cryptoImg')
   return (
     <View style={styles.infoContainer}>
       <View style={styles.infoContainer__items}>
         <Image source={{uri: cryptoImg}} style={{width:74, height: 74}} />
         <Text style={styles.infoContainer__title}>{cryptoObj.name}</Text>
         <Text style={styles.infoContainer__price}>{cryptoObj.quotes.USD.price.toFixed(3)} $/{cryptoObj.symbol}</Text>
         <Text style={styles.infoContainer__values}></Text>
         <View>
           <Text style={styles.valuesContainer__values}>Volume (24h): {cryptoObj.quotes.USD.volume_24h.toFixed(2)}</Text>
           <Text style={styles.valuesContainer__values}>Market Cap: {Math.round(cryptoObj.quotes.USD.market_cap)} USD</Text>
           <Text style={styles.valuesContainer__values}>Change (24h): {cryptoObj.quotes.USD.percent_change_24h}%</Text>
           <Text style={styles.valuesContainer__values}>Change (7d): {cryptoObj.quotes.USD.percent_change_7d}%</Text>
         </View>
       </View>
     </View>
   )
 }
}


class CryptoList extends Component {
  static navigationOptions = {
    title: 'Home'
  }


  state = {
    filterSearch:[],
    apiOutput:null,
    isFavScreen:false,
  }


  componentDidMount() {
    this._getAPI()
    this._handleShakeEvent()
  }


  componentWillUnmount() {
    RNShakeEvent.removeEventListener('shake');
  }


  _getAPI = () => {
    fetch('https://api.coinmarketcap.com/v2/ticker/')
      .then(res => res.json())
      .then(json => {
        this.setState({apiOutput:_.values(json.data)});
      })
  }

  _handleShakeEvent = () => {
    RNShakeEvent.addEventListener('shake', () => {
      this.props.navigation.navigate('Favourites')
    })
  }


  _searchCrypto = (text) => {
    this.setState(prev => ({filterSearch:text, apiOutput: prev.apiOutput}))
  }



  _renderHeader = () => {
    return <SearchBar
            round
            onChangeText={this._searchCrypto}
            placeholder='Type Here...' />
   }

  _renderList = ({ item }) => {
    const url = `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`
    return (
      <ListItem
        style={{backgroundColor:"black"}}
        roundAvatar
        title={item.name}
        subtitle={item.symbol}
        avatar={{uri:url}}
        onPress={() => this.props.navigation.navigate('CryptoDetails', { cryptoObj: item , cryptoImg: url})}
      />
    )
  }

  _renderFooter = () => {
     if (!this.state.apiOutput || this.state.filterSearch.length > 0 ) return null;

    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" />
      </View> )
  }

  _renderFlatList = () => {
    let filterList = this.state.apiOutput
    if (this.state.filterSearch) {
      filterList = filterList.filter(crypto => crypto.name.includes(this.state.filterSearch))
    }

    return (<FlatList
      data={filterList}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={this._renderHeader}
      ListFooterComponent={this._renderFooter}
      renderItem={this._renderList}
      >
    </FlatList>)
  }

  render() {
    return (
      <View style={styles.container}>
        <List containerStyle={styles.listStyle}>
          { this.state.apiOutput ? this._renderFlatList() : <Text style={styles.loadingText}>Loading...</Text> }
        </List>
      </View>

    )
  }
}


export default createStackNavigator(
  // THIS IS THE CONFIG OBJECT
  // [codename]: {screen: MyComponent}
  {
    Home: CryptoList,
    CryptoDetails: CryptoItem,
    Favourites: CryptoFavList
  },
  {
    initialRouteName: 'Home',
  }
)


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
    fontSize: 40,
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
}
