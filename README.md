# esm-providers
 > Collection of package/modules aka code providers

## install
```sh
npm i @vandeurenglenn/esm-providers
```

## usage
```js
import {availableProviders, get} from '@vandeurenglenn/esm-providers'

console.log(availableProviders) // ['fs', 'npm', 'github']
 
const data = await get('@lefcoin/standards') // iterates trough all available providers
```