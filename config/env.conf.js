const argvs = process.argv.slice(2);

function getParams(key) {
  let item = argvs.find(item => item.split('=')[0] === key);
  return item ? item.split('=') : []
}

// Multi Modules
class MultiModule {
  constructor(name, opts) {
    Object.assign(this, {
      name,
      port: 9000,
      host: '0.0.0.0',
      filename: '',
      title: '',
      appVersion: 1.1,
      dev: { // If the independent app has the dev variable configured, then the configuration here does not take effect
        staticURL: './',
        //apiURL: 'http://192.168.1.22:8086',
        apiURL: 'http://dev.myapp.com',
        webURL: 'http://dev.web.myapp.com',
        dist: 'dev',
      },
      uat: { // If the independent app has the dev variable configured, then the configuration here does not take effect
        staticURL: './',
        apiURL: 'http://uat.myapp.com',
        webURL: 'http://uat.web.myapp.com',
        dist: 'uat',
      },
    }, opts)
  }
}

function getModuleProcess(name) {
  let mItem = importModules.find(item => item.name === name);
  return mItem || importModules[0];
}

/** Multi module independent configuration **/
const importModules = [new MultiModule('domesticApp', {
  port: 10000,
  filename: 'index.html',
  title: 'domestic.demo',
  sysApp: 'domesticApp',
  sysName: 'domestic',
  test: { // this is the domestic test env variable
    staticURL: './',
    apiURL: 'http://test.myapp.com',
    webURL: 'http://test.web.myapp.com',
    dist: 'test',
  },
  prod: { // this is the domestic prod env variable
    staticURL: './',
    apiURL: 'http://api.myapp.com',
    webURL: 'http://web.myapp.com',
    dist: 'prod',
  },
}),new MultiModule('globalApp', {
  port: 9000,
  filename: 'index.html',
  title: 'global.demo',
  sysApp: 'globalApp',
  sysName: 'global',
  test: { // this is the global test env variable
    staticURL: './',
    apiURL: 'http://test.myapp.com',
    webURL: 'http://test.web.myapp.com',
    dist: 'test',
  },
  prod: { // this is the global prod env variable
    staticURL: './',
    apiURL: 'http://api.myapp.com',
    webURL: 'http://web.myapp.com',
    dist: 'prod',
  },
})];

let eventName = String(process.env.npm_lifecycle_event).split('-');
let moduleName = getParams('name')[1] || eventName[1];

const envConfig = {
  modules: importModules,
  process: getModuleProcess(moduleName),
  getNodeENV(obj) {
    return getENV('node', obj, envConfig.process);
  },
  getBuildENV(obj) {
    return getENV('build', obj, envConfig.process);
  },
};

function getENV(type, obj, params) {
  let item;
  for (let x in params) {
    item = params[x];
    if (typeof item === 'object' && x === JSON.parse(obj.prod)) {
      getENV(type, obj, item);
    }
    if (typeof item !== 'object') {
      if (type === 'node') {
        obj[x] = '"' + item + '"';
      }
      if (type === 'build') {
        obj[x] = item;
      }
    }
  }
  return obj;
}

module.exports = envConfig;
