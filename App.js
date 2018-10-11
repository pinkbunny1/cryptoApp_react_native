import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
 } from 'react-native';
 import _ from 'lodash'
import { SearchBar, List, ListItem } from 'react-native-elements'
import {createStackNavigator} from 'react-navigation'
import RNShakeEvent from 'react-native-shake-event'

import CryptoItem from './components/CryptoItem';
import CryptoFavList from './components/CryptoFavList';

const FAVORITEDBKEY = 'favorites';

const MYFAVORITES = [1,2,3];

const TEMPLIST = []

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
    //this.resetDB();
    this._getAPI()
    this._handleShakeEvent()
  }
  async resetDB() {
    await AsyncStorage.setItem(FAVORITEDBKEY, JSON.stringify(TEMPLIST));
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
