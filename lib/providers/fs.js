import { access } from 'node:fs/promises'
import { join } from 'node:path'

export const has = async path => {
  try {
    await access(path)
    return true
  } catch (error) {
    return
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
  return has(join(destination, name))
}
