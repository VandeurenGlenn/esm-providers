import * as providers from './lib/providers.js'

export const availableProviders = Object.entries(providers).map(provider => (provider[0]))

/**
 * 
 * @param {*} name 
 * @param {options} options {version: string, provider: string}
 * @returns 
 */
export const get = async (name, options = { destination: 'node_modules'}) => {
  if (options.provider) return providers[options.provider].get(name, options.destination)

  const iterate = async function* (name, destination) {
    for (const provider of Object.values(providers)) {
      try {        
        const data = await provider.get(name, destination)
        yield data
      } catch (error) {
        console.log(error);
      }
    }
  }

  const iterator = iterate(name, options.destination)
  
  for await (const data of iterator) {
    if (data) return data
  }
  
  
}