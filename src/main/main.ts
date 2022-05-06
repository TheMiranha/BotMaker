/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import fs from 'fs';
import fsextra from 'fs-extra';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Database from 'better-sqlite3';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import webpackPaths from '../../.erb/configs/webpack.paths';
import { dialog } from 'electron'

// import defaults_inits from ('./data/models/defaults/inits');
import { fileURLToPath } from 'url';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('saveEvent', async (event, arg) => {
  var {bot, evento} = arg;
  fs.writeFileSync('./data/bots/' + bot + '/apis/' + evento.folder + '/' + evento.nome + '.js', evento.code);
  event.reply('saveEvent', {response: true});
});

ipcMain.on('saveApis', async (event, arg) => {
  var {bot, apis} = arg;
  console.log('hu!')
  var packageJson = fs.readFileSync('./data/bots/' + bot + '/package.json', 'utf8');
  packageJson = JSON.parse(packageJson);
  apis.forEach(api => {
    switch (api.nome){
      case 'Música(Distube)':
        if (api.instalado)
        {
          packageJson.dependencies['@discordjs/opus'] = '^0.7.0';
          packageJson.dependencies['@discordjs/voice'] = '^0.8.0';
          packageJson.dependencies['@distube/soundcloud'] = '^1.1.0';
          packageJson.dependencies['@distube/spotify'] = '^1.2.1';
          packageJson.dependencies['@distube/yt-dlp'] = '^0.0.2';
          packageJson.dependencies['distube'] = '^3.3.1';
          packageJson.dependencies['ffmpeg-static'] = '^5.0.0';
          packageJson.dependencies['libsodium-wrappers'] = '^0.7.10';
          packageJson.dependencies['discord-ytdl-core'] = '^5.0.4';
          fsextra.copySync('./data/models/apis/distube_commands', './data/bots/' + bot + '/commands');
          fsextra.copySync('./data/models/apis/distube_events', './data/bots/' + bot + '/apis/distube_events');
          fs.copyFileSync('./data/models/apis/distube.js', './data/bots/' + bot + '/apis/distube.js');
        } else {
          delete packageJson.dependencies['@discordjs/opus'];
          delete packageJson.dependencies['@discordjs/voice'];
          delete packageJson.dependencies['@distube/soundcloud'];
          delete packageJson.dependencies['@distube/spotify'];
          delete packageJson.dependencies['@distube/yt-dlp'];
          delete packageJson.dependencies['distube'];
          delete packageJson.dependencies['ffmpeg-static'];
          delete packageJson.dependencies['libsodium-wrappers'];
          delete packageJson.dependencies['discord-ytdl-core'];
          var comandos = ['connect', 'disconnect', 'filters', 'loop', 'pause', 'play', 'playskip', 'previous', 'queue', 'shuffle', 'stop', 'volume', 'seek', 'skip'];
          comandos.forEach(comando => {
            fs.unlinkSync('./data/bots/' + bot + '/commands/' + comando + '.js');
          }
          );
          fsextra.removeSync('./data/bots/' + bot + '/apis/distube_events');
          fs.unlinkSync('./data/bots/' + bot + '/apis/distube.js');
        }
      break;
      case 'Axios(Requisições Web)':
        if (api.instalado) {
          packageJson.dependencies['axios'] = '^0.27.2';
        } else {
          delete packageJson.dependencies['axios'];
        }
      break;
      case 'Puppeteer(Emulador de navegador)':
        if (api.instalado) {
          packageJson.dependencies['puppeteer'] = '^13.7.0';
        } else {
          delete packageJson.dependencies['puppeteer'];
        }
      break;
      case 'JsonWebToken(Token de autenticação)':
        if (api.instalado) {
          packageJson.dependencies['jsonwebtoken'] = '^8.5.1';
        } else {
          delete packageJson.dependencies['jsonwebtoken'];
        }
      break;
      default:
    }
  });
  fs.writeFileSync('./data/bots/' + bot + '/package.json', JSON.stringify(packageJson));
  event.reply('saveApis', {response: true})
})

ipcMain.on('deleteBot', async (event, arg) => {
  var {bot} = arg;
  fs.rmSync('./data/bots/' + bot, { recursive: true, force: true });
  event.reply('deleteBot', {response: true})
})

ipcMain.on('saveConfig', async (event, arg) => {
  var {bot, config} = arg;
  fs.writeFileSync('./data/bots/' + bot + '/config.json', JSON.stringify(config));
  event.reply('saveConfig', {response: true});
})

ipcMain.on('exportBot', async (event, arg) => {
  var {nome} = arg;
  var caminho = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  caminho = caminho.filePaths;
  console.log(nome);
  fsextra.copy('./data/bots/' + nome, caminho + '/' + nome, (err) => {
    if (err) throw err;
      event.reply('exportBot', {response: true})
  });
});

ipcMain.on('deleteCommand', async (event, arg) => {
  var {bot, nome} = arg;
  fs.unlink('./data/bots/' + bot + '/commands/' + nome + '.js', (err) => {
    if (err) throw err;
    event.reply('deleteCommand', {response: true})
  })
});

ipcMain.on('createCommand', async (event, arg) => {
  var {bot, nome} = arg;
  var conteudo = `exports.run = (client, message) => {
    // Digite seu código
}`;
  fs.writeFile('./data/bots/' + bot + '/commands/' + nome + '.js', conteudo, (err) => {
    if (err) throw err;
    event.reply('createCommand', {response: true});
})
});

ipcMain.on('saveCommand', async (event, arg) => {
  var {bot, comando} = arg;
  fs.writeFile('./data/bots/' + bot + '/commands/' + comando.nome + '.js', comando.code, (err) => {
    if (err) throw err;
    event.reply('savedCommand', {response: true});
  })
})

ipcMain.on('getBot', async (event, arg) => {
  var comandos = [];
  var files = fs.readdirSync('./data/bots/' + arg + '/commands');
  files.forEach(file => {
    var nome = file.split('.')[0];
    var code = fs.readFileSync('./data/bots/' + arg + '/commands/' + file, 'utf8');
    comandos.push({nome, code})
  });
  var config = fs.readFileSync('./data/bots/' + arg + '/config.json', 'utf8');
  config = JSON.parse(config);
  var packageJson = fs.readFileSync('./data/bots/' + arg + '/package.json', 'utf8');
  packageJson = JSON.parse(packageJson);
  var apis = [];
  var dependencias = Object.keys(packageJson.dependencies);
  if (dependencias.indexOf('distube') > -1)
  {
    apis.push({nome: 'Música(Distube)', instalado: true});
  } else {
    apis.push({nome: 'Música(Distube)', instalado: false});
  }
  if (dependencias.indexOf('axios') > -1)
  {
    apis.push({nome: 'Axios(Requisições Web)', instalado: true});
  } else {
    apis.push({nome: 'Axios(Requisições Web)', instalado: false});
  }
  if (dependencias.indexOf('puppeteer') > -1)
  {
    apis.push({nome: 'Puppeteer(Emulador de navegador)', instalado: true});
  } else {
    apis.push({nome: 'Puppeteer(Emulador de navegador)', instalado: false});
  }
  if (dependencias.indexOf('jsonwebtoken') > -1)
  {
    apis.push({nome: 'JsonWebToken(Token de autenticação)', instalado: true});
  } else {
    apis.push({nome: 'JsonWebToken(Token de autenticação)', instalado: false});
  }
  var events = [];
  var apis_folders = fs.readdirSync('./data/bots/' + arg + '/apis',{ withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);
  for (var i = 0; i < apis_folders.length; i++) {
    var event_folder = apis_folders[i];
    var event_files = fs.readdirSync('./data/bots/' + arg + '/apis/' + event_folder);
    for (var j = 0; j < event_files.length; j++) {
      var event_file = event_files[j];
      var event_code = fs.readFileSync('./data/bots/' + arg + '/apis/' + event_folder + '/' + event_file, 'utf8');
      events.push({nome: event_file.split('.')[0], code: event_code, folder: event_folder})
    }
  }
  event.sender.send('getBot', {nome: arg, comandos, config, packageJson, apis, events});
})

ipcMain.on('getBots', async (event, arg) => {
  fs.readdir('./data/bots', {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    var bot_folders = files.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    event.sender.send('getBots', bot_folders);
  })
})

ipcMain.on('createBot', async (event, arg) => {
  var {nome, prefix, token} = arg;
  fsextra.copy('./data/templates/init', './data/bots/' + nome, (err) => {
    if (err) throw err;
    fs.readFile('./data/bots/' + nome + '/package.json', (err, data) => {
      if (err) throw err;
      var packageJson = JSON.parse(data);
      packageJson.name = nome;
      fs.writeFile('./data/bots/' + nome + '/package.json', JSON.stringify(packageJson), err => {
        if (err) throw err;
        fs.readFile('./data/bots/' + nome + '/config.json', (err, data) => {
          if (err) throw err;
          var configJson = JSON.parse(data);
          configJson.prefix = prefix;
          configJson.token = token;
          fs.writeFile('./data/bots/' + nome + '/config.json', JSON.stringify(configJson), err => {
            if (err) throw err;
            event.reply('createBot', {response: true})
          })
        })
      })
    })
  })
})

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  event.reply('ipc-example', msgTemplate('pong'));
});

try {
  fs.mkdirSync('data');
} catch (error) {}
try {
  fs.mkdirSync('./data/bots');
} catch (error) {}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';


if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    title: 'BotMaker',
    // frame:false,
    autoHideMenuBar: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });


  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

  