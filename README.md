# Crypto App with react-native

### Using Public API from coinmarketcap to render a list of cryptocurrencies with its prices.


## Instruction to run
```bash
clone https://github.com/pinkbunny1/cryptoApp_react_native.git
cd crypto_react_native_app
npm install
react-native run-ios (For IOS)
react-native run-andriod (For Android)
```
## Trouble Shooting
- Bundling Error : `react-native start --reset-cache`


## Take the `package.json` to update the dependencies and work on `App.js`
- CryptoItem : Shows the detailed view of cruptocurrency. it has `cryptoObj` so no need to call API
- CryptoList : Shows LIST view of all cryptos

## App : Dark Themed
![App Home](images/appLook1. =50x)


## To Do:
- [x] Finish HomeScreen (CryptoList View)
- [x] Add Navigation
- [x] Add Crypto Detailed Screen (CryptoItem View)
- [ ] Finish Crypto Detailed Screen (CryptoItem View)
- [ ] Add Favourite Crypto Screen (CryptoFav View)
- [ ] Finish Favourite Crypto Screen (CryptoFav View)
- [ ] Finish search feature (CryptoList View)
