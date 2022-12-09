/**
 * checkout [semver](https://semver.org/) to learn what Semantic Versioning means 
 */
declare type semver = string

/**
 * checkout [Working with Git Branches](https://www.w3schools.com/git/git_branch.asp?remote=github) to learn what a branch is
 */
declare type branch = string


declare type moduleData = {
  name: string,
  path: path,
  exports: {
    main: path | undefined
    submodule: path | undefined
  }
}

declare type providerSearchResult = {
  url: URL
}

declare interface options {
  version: string
  provider: string
}

declare interface provider {
  has?(name: string, destination: path): boolean
  search?(name: string): providerSearchResult
  get(name: string, destination: path): moduleData
}

declare module '@vandeurenglenn/esm-providers' {
  export {availableProviders, get} from './lib/esm-providers.js'  
}