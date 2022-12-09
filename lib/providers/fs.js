import { access, readdir, readFile } from 'node:fs/promises'
import { format, parse, join } from 'node:path'

export const has = async path => {
  try {
    await access(path)
    return true
  } catch (error) {
    return false
  }
}

/**
 * 
 * @param {string} name name of the package
 * @param {path} destination where to search for the package?
 * 
 * @return {Promise<{name: string, path: path, version: semver, exports: string{}}>}
 */
export const get = async (name, destination = 'node_modules') => {
  const path = join(destination, name)
  if (await has(path)) {
    const pkg = JSON.parse((await readFile(join(path, 'package.json'))).toString())
    
    return {
      name,
      path,
      version: pkg.version,
      exports: {
        ...pkg.exports,
        main: pkg.main
      }
    }
  }
}
