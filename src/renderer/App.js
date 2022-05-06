import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home/Home'
import CreateBot from './screens/CreateBot/CreateBot'
import Bot from './screens/Bot/Bot'
import './App.css';
import { WindPowerOutlined } from '@mui/icons-material';
import { useState } from 'react';

var transfer = {};

export default function App(props) {

  const API = {
    getBots: (callBack) => {
      window.electron.ipcRenderer.once('getBots', callBack);
      window.electron.ipcRenderer.getBots();
    },
    createBot: (bot, callBack) => {
      window.electron.ipcRenderer.once('createBot', callBack);
      window.electron.ipcRenderer.createBot(bot);
    },
    getBot: (nome, callBack) => {
      window.electron.ipcRenderer.once('getBot', callBack);
      window.electron.ipcRenderer.getBot(nome);
    },
    setTransfer: (data) => {
      transfer = data;
    },
    saveCommand: (obj, callBack) => {
      window.electron.ipcRenderer.once('saveCommand', callBack)
      window.electron.ipcRenderer.saveCommand(obj);
    },
    createCommand: (obj, callBack) => {
      window.electron.ipcRenderer.once('createCommand', callBack)
      window.electron.ipcRenderer.createCommand(obj);
    },
    deleteCommand: (obj, callBack) => {
      window.electron.ipcRenderer.once('deleteCommand', callBack)
      window.electron.ipcRenderer.deleteCommand(obj);
    },
    exportBot: (obj, callBack) => {
      window.electron.ipcRenderer.once('exportBot', callBack)
      window.electron.ipcRenderer.exportBot(obj);
    },
    saveConfig: (obj, callBack) => {
      window.electron.ipcRenderer.once('saveConfig', callBack)
      window.electron.ipcRenderer.saveConfig(obj);
    },
    deleteBot: (obj, callBack) => {
      window.electron.ipcRenderer.once('deleteBot', callBack)
      window.electron.ipcRenderer.deleteBot(obj);
    },
    saveApis: (obj, callBack) => {
      window.electron.ipcRenderer.once('saveApis', callBack)
      window.electron.ipcRenderer.saveApis(obj);
    },
    saveEvent: (obj, callBack) => {
      window.electron.ipcRenderer.once('saveEvent', callBack)
      window.electron.ipcRenderer.saveEvent(obj);
    },
    getTransfer: () => {
      return transfer;
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home api={API}/>} />
        <Route path="/criarBot" element={<CreateBot api={API}/>} />
        <Route path="/bot/:id" element={<Bot api={API}/>} />
      </Routes>
    </Router>
  );
}
