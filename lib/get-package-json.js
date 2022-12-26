import { readFile } from 'fs/promises'
import { join } from 'path'

const getPackageJson = async (path, pkg = {}) => {  
  try {
    pkg = JSON.parse((await readFile(join(path, 'package.json'))).toString())
  } catch (error) {
    if (error.code === 'ENOENT' && !path.includes('@types')) console.log(`no package.json found, if you think no package is needed, create a pr to include it to the ignore list.
    note that you can also pas a packageConfig yourself:
    
    getPackgeJSON(path, {dependencies: {}})
    
    or
    
    esmProviders(moduleName, { packageJson: dependencies: {} })
    `);
  }

  return pkg
}

export { getPackageJson as default }