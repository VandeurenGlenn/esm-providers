import decompress from 'decompress';
import download from 'download';
import { access, mkdir } from 'node:fs/promises'
import { join, sep } from 'node:path';

export const search = async program => {
  const data = await fetch(`https://api.github.com/search/repositories?q=${program}&sort=stars&order=desc`);
  const result = (await data.json()).items

  if (result) {
    const choices = result.filter(({ full_name, name, description, html_url }) => {
      return (name === program || program === full_name)
    });
    return {
      url: choices?.[0].html_url,
      branch: choices?.[0].default_branch,
      name: choices?.[0].name
    }
  }
  return  
}

/**
 * 
 * @param {*} name 
 * @param {*} destination 
 * @param {*} targetBranch branch to download, defaults to the repos default_branch
 * @returns 
 */
export const get = async (name, destination = 'node_modules', targetBranch) => {
  const originalName = name
  name = name.replace('@', '')
  const path = join(destination, originalName)

  const target = await search(name)
  targetBranch = targetBranch || target.branch
  if (target) {
    if (!target.url.includes('archive')) target.url = `${target.url.replace(/$\/+/, '')}/archive/${targetBranch}.tar.gz`;
    const data = await download(target.url);
    console.log(`there is some unpacking going on, please hang tight`);
    try {
      await access(path)
    } catch (error) {
      if (error.code === 'ENOENT') try {
        await mkdir(path)
      } catch {
          let _path = destination
          let splits = path.split(destination)
          splits = splits.slice(1, splits.length)
          splits = splits[0].split(sep)
          for (const split of splits) {
            _path = join(_path, split)
            try {
              await mkdir(_path)
            } catch {

            }
          }        
      }
      
    }

    await decompress(data, path, {
      map: file => {
        file.path = file.path.replace(`${target.name}-${targetBranch}`, '')
        return file;
      }
    }) 
    return true
  }
  return
}