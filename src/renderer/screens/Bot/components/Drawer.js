import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TerminalIcon from '@mui/icons-material/Terminal';
import JavascriptIcon from '@mui/icons-material/Javascript';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import { useNavigate } from 'react-router';

const drawerWidth = 260;

export default function PermanentDrawerLeft(props) {

  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Divider />
        <List>
          <ListItem button onClick={() => {navigate('/')}}>
            <ListItemIcon>
              <ArrowBackIcon color="secondary"/>
            </ListItemIcon>
            <ListItemText primary={<Typography color="secondary" variant="button">Voltar</Typography>}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={<Typography color="primary" variant="button">{props.bot.nome}</Typography>}/>
          </ListItem>
        </List>
        <Divider/>
        <List>
          <ListItem>
            <ListItemIcon><TerminalIcon color="success"/></ListItemIcon>
            <ListItemText primary={'Comandos'}/>
          </ListItem>
          {props.bot.comandos.map(comando => (
            <ListItem onClick={() => {props.handleSelectCode({...comando, type: 'command'})}} button key={comando.nome}>
              <ListItemIcon>
                <JavascriptIcon fontSize={'medium'} color="warning"/>
              </ListItemIcon>
              <ListItemText primary={comando.nome + '.js'}/>
            </ListItem>
          ))}
        </List>
        <ListItem button onClick={() => {props.setCreatingCommand(true)}}>
          <ListItemIcon><AddIcon color="secondary"/></ListItemIcon>
          <ListItemText primary={'Criar comando'}/>
        </ListItem>
        <Divider/>
        <List>
          <ListItem>
            <ListItemIcon>
              <AlarmOnIcon color="warning"/>
            </ListItemIcon>
            <ListItemText primary={'Eventos'}/>
          </ListItem>
          {props.bot.events.map(evento => {
            return (
              <ListItem button onClick={() => {
                props.handleSelectCode({...evento, type: 'event'})
              }}key={evento.nome}>
                <ListItemIcon>
                <JavascriptIcon fontSize={'medium'} color="secondary"/>
              </ListItemIcon>
              <ListItemText primary={evento.nome}/>
            </ListItem>
            )
          })}
        </List>
        <Divider/>
        
        <List>
        <ListItem onClick={() => {props.setOpenConfigModal()}} button>
            <ListItemIcon><SettingsIcon color="primary"/></ListItemIcon>
            <ListItemText primary={'Configurações'}/>
          </ListItem>
        <ListItem button onClick={props.exportBot}>
            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
            <ListItemText primary={'Exportar'}/>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
