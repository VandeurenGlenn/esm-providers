import {availableProviders, get} from "./esm-providers.js";

console.log(availableProviders);

const result = await get('@leofcoin/standards')
console.log(result);