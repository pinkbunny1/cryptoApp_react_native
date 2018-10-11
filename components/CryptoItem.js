import React, {Component} from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
 } from 'react-native'
 import _ from 'lodash'





const FAVORITEDBKEY = 'favorites'

export default class CryptoItem extends Component {
    state = {
        isFavorited: false
    }

    static navigationOptions = {
      title: 'Info',
    }
    componentDidMount(){
        this.fetchAllFavs()
    }

    async fetchAllFavs(){
        const favs = await AsyncStorage.getItem(FAVORITEDBKEY)
        const favsList = JSON.parse(favs)

        const currentFav = this.props.navigation.getParam('cryptoObj')
        favsList.forEach(fav =>  {
            if (fav.id === currentFav.id){
                this.setState({isFavorited: true})
            }
        })
    }

  _asyncStorageFunction = async () => {
    let idArray
    let savedText = 'Saved your favorite'
    let favorite = this.props.navigation.getParam('cryptoObj')

     try {
        const favorites = await AsyncStorage.getItem(FAVORITEDBKEY)
        const favsList = JSON.parse(favorites)

        const found = favsList.some(function (fav) {
            return fav.id === favorite.id
        })
        if(found){
            const newFavs = favsList.filter(fav => fav.id !== favorite.id)
            await AsyncStorage.setItem(FAVORITEDBKEY, JSON.stringify(newFavs))
            this.setState({isFavorited: false})
        } else {
            const newFavs = [...favsList, favorite]
            await AsyncStorage.setItem(FAVORITEDBKEY, JSON.stringify(newFavs))
            this.setState({isFavorited: true})
        }
    } catch (error) {
      // Error saving data
      console.warn('could not save', err)
    }
  }





    render() {
      const cryptoObj = this.props.navigation.getParam('cryptoObj')
      const cryptoImg =  this.props.navigation.getParam('cryptoImg')

      const renderFavoriteButton = () => {
          if (this.state.isFavorited) {
              return <Text style={styles.favoriteButton__text}>Unfollow</Text>
          } else {
              return <Text style={styles.favoriteButton__text}>Follow</Text>
          }
      }

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

            <TouchableOpacity
             onPress={this._asyncStorageFunction}>
                <View style={styles.favoriteButton}>
                    {renderFavoriteButton()}
                </View>
            </TouchableOpacity>
          </View>
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
