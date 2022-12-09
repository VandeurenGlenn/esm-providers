import decompress from 'decompress';
import download from 'download';
import { mkdir } from 'node:fs/promises';
import { access, readFile } from 'node:fs/promises'
import { join, sep } from 'node:path';

export const search = async program => {
  const data = await fetch(`https://api.github.com/search/repositories?q=${program}&sort=stars&order=desc`);
  const result = await data.json().items
  if (result) {
    const choices = result.filter(({ full_name, name, description, html_url }) => {
      return (name === program || program === full_name)
    });
    return {
      url: choices?.[0].html_url
    }
  }
  return  
}

export const get = async (name, destination = 'node_modules', version = 'main') => {
  const originalName = name
  name = name.replace('@', '')
  const path = join(destination, originalName)
  const target = await search(name)
  console.log(target);
  if (target) {
    if (!target.url.includes('archive')) target.url = `${target.url.replace(/$\/+/, '')}/archive/${version}.tar.gz`;
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
            console.log(_path);
            try {
              await mkdir(_path)
            } catch {

            }
          }
        
      }
      
    }
console.log(data);
console.log(data.toString());
    await decompress(data, path, {
      map: file => {
        console.log(file.path);
        console.log(file.path);
        if (version && version !== 'main') file.path = file.path.replace(`-${version}`, '')
        else file.path = file.path.replace('-main', '')        
        return file;
      }
    })

    const pkg = JSON.parse((await readFile(join(path, 'package.json'))).toString())
    
    return {
      name: originalName,
      path,
      version: pkg.version,
      exports: {
        ...pkg.exports,
        main: pkg.main
      }
    }
  }
  return
}