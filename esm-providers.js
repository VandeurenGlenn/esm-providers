import getPackageJson from './lib/get-package-json.js'
import * as providers from './lib/providers.js'
import { join } from 'path'

export const availableProviders = Object.entries(providers).map(provider => (provider[0]))

const providerResult = async (name, destination, packageJson = {}) => {
  
  if (Object.keys(packageJson).length === 0) packageJson = await getPackageJson(join(destination, name))

  const { version, exports, dependencies, devDependencies } = packageJson
  return {
    name,
    version,
    exports,
    dependencies,
    devDependencies,
    path: join(destination, name)
  }
}

/**
 * 
 * @param {*} name 
 * @param {options} options {version: string, provider: string}
 * @returns 
 */
export const get = async (name, options = { packageJson: {}, destination: 'node_modules' }) => {
  if (!options.destination) options.destination =  'node_modules'
  if (options.provider && !availableProviders.includes(options.provider)) throw new Error(`unsupported provider, got ${options.provider}.\n\navailableProviders:\n  -${availableProviders.join('\n  -')}`)
  if (options.provider) {
    await providers[options.provider].get(name, options.destination)
    return providerResult(name, options.destination, options.packageJson)
  }
  
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
    if (data) return providerResult(name, options.destination, options.packageJson)
  }

  return
}