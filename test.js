import {availableProviders, get} from "./esm-providers.js";

console.log(availableProviders);

const result = await get('@leofcoin/standards')
console.log(result);

try {
  const badProvider = await get('@leofcoin/standards', {provider: 'my-provider'})
  console.log('badProvider');
  process.exit(1)
} catch (error) {
  
}

try {
  const goodProvider = await get('@leofcoin/standards', {provider: 'npm'})
} catch (error) {
  console.log('good-provider');
  process.exit(1)
}
process.exit(0)