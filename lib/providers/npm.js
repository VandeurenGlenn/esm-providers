import download from 'download'
import decompress from 'decompress'
import { join } from 'path'
import { readFile } from 'fs/promises';

export const search = async (name) => {
  let data = await fetch(`https://registry.npmjs.com/${name}`);
  data = await data.json()
  if (data.error && data.error === 'Not found') return
  else if (data.error) return
  let version
  version = data['dist-tags'].latest.split(',')[0]
  return {
    version,
    url: data.versions[version].dist.tarball
  }    
}

export const get = async (name, destination) => {
  const target = await search(name)
  const data = await download(target.url);
  await decompress(data, join(destination, name), {
    map: file => {
      const splits = file.path.split(/\/|\\/g)
      file.path = file.path.replace('package', '')
      return file;
    }});

  const pkg = JSON.parse((await readFile(join(destination, name, 'package.json'))).toString())
  console.log(`added ${name}@${target.version}`);
  return {
    name,
    path: join(destination, name),
    version: pkg.version,
    exports: pkg.exports,
    dependencies: pkg.dependencies,
    devDependencies: pkg.devDependencies
  }
}