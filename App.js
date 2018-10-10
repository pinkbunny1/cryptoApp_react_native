import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
 } from 'react-native';
 import _ from 'lodash'

import { SearchBar, List, ListItem } from 'react-native-elements'
import {createStackNavigator} from 'react-navigation'





class CryptoItem extends Component {
  static navigationOptions = {
    title: 'Info'
  }


  render() {
    const cryptoObj = this.props.navigation.getParam('cryptoObj')
    return (
      <View>
        {/* Crypto Obj data structure */}
        {/* "id": 1,
        "name": "Bitcoin",
        "symbol": "BTC",
        "website_slug": "bitcoin",
        "rank": 1,
        "circulating_supply": 17314525,
        "total_supply": 17314525,
        "max_supply": 21000000,
        "quotes": {
          "USD": {
            "price": 6568.29741754,
            "volume_24h": 3825153799.08662,
            "market_cap": 113726949843,
            "percent_change_1h": 0.11,
            "percent_change_24h": -0.79,
            "percent_change_7d": 1.16
          }
        },
        "last_updated": 1539175942 */}
        <Text>{cryptoObj.rank}</Text>
        <Text>{cryptoObj.quotes.USD.price}</Text>

      </View>
    )
  }
}



class CryptoList extends Component {
  static navigationOptions = {
    title: 'Home'
  }

  componentDidMount() {
   fetch('https://api.coinmarketcap.com/v2/ticker/')
     .then(res => res.json())
     .then(json => {
       this.setState({apiOutput:json.data});
     })

  }
  state = {
    inputText: "",
    showText: "",
    apiOutput:null
  };



  _renderHeader = () => {
    return <SearchBar
            round
            // onChangeText={someMethod}
            // onClearText={someMethod}
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
        onPress={() => this.props.navigation.navigate('CryptoDetails', { cryptoObj: item })}
      />
    )
  }

  _renderFooter = () => {
     if (!this.state.apiOutput) return null;

    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" />
      </View> )
  }

  _renderFlatList = () => {
    return (<FlatList
      data={_.values(this.state.apiOutput)}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={this._renderHeader}
      ListFooterComponent={this._renderFooter}
      renderItem={this._renderList}
      >
    </FlatList>)
  }

  render() {
    return (
        <List containerStyle={styles.listStyle}>
          { this.state.apiOutput ? this._renderFlatList() : <Text style={styles.loadingText}>Loading...</Text> }
        </List>

    )
  }
}


export default createStackNavigator(
  // THIS IS THE CONFIG OBJECT
  // [codename]: {screen: MyComponent}
  {
    Home: CryptoList,
    CryptoDetails: CryptoItem,
  },
  {
    initialRouteName: 'Home',
  }
)


// const styles = StyleSheet.create({
const styles = {
  random: {
    flex:1,

  },
  listStyle: {
    backgroundColor: 'black',
    marginTop: 0,
  },

  loadingText: {
    fontSize: 40,
  }
}
