import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ApiIcon from '@mui/icons-material/Api';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Checkbox, Stack, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "90vw",
  height: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {

    const [screen, setScreen] = React.useState('basico');
    const [config, setConfig] = React.useState(props.bot.config);
    const [apis, setApis] = React.useState(props.bot.apis);

    const changeApi = (api, instalado) => {
      var index = apis.findIndex(a => a.nome == api);
      var newobj = {nome: api, instalado: !instalado};
      var temp = [...apis];
      temp[index] = newobj;
      setApis(temp);
    }

    const LoadScreen = () => {
        switch(screen) {
            case 'apis':
              return (
                    <List>
                        <Typography variant="h6" sx={{mb: 2, ml: 2}}>
                            <Stack direction={'row'}>
                              <SmartToyIcon color="primary" sx={{mt: 0.5, mr: 2}}/>
                              APIs
                            </Stack>
                        </Typography>
                        <List sx={{mt: 2}}>
                          {apis.map(x => {
                            return (
                              <Box key={x.nome} sx={{  bgcolor: 'background.paper',boxShadow: 5, width: 400, paddingTop: 1, paddingLeft: 4, paddingBottom: 1, borderRadius: 5, mt: 1}}>
                                <Typography color="success" style={{color: 'green'}} variant="subtitle1">
                                  <Checkbox onChange={e => {changeApi(x.nome, x.instalado)}} checked={x.instalado}/>
                                  {x.nome}
                                </Typography>
                              </Box>
                            )
                          })}
                          <ListItem>
                            <ListItemText>
                              <Button onClick={() => {props.saveApis(apis)}}>Salvar</Button>
                            </ListItemText>
                          </ListItem>
                        </List>
                    </List>
              )
            case 'basico':
                return (
                    <List>
                        <Typography variant="h6" sx={{mb: 2, ml: 2}}>
                            <Stack direction={'row'}>
                              <SmartToyIcon color="primary" sx={{mt: 0.5, mr: 2}}/>
                              Configurações Básicas
                            </Stack>
                        </Typography>
                        <ListItem>
                            <ListItemIcon>Prefix:</ListItemIcon>
                            <ListItemText>
                                <Stack direction={'row'}>
                                    <TextField value={config.prefix} onChange={(e) => {setConfig({token: config.token, prefix: e.target.value})}} placeholder="Prefix de comandos" size="small"/>
                                </Stack>
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>Token:</ListItemIcon>
                            <ListItemText>
                                <Stack direction={'row'}>
                                    <TextField value={config.token} onChange={(e) => {setConfig({prefix: config.prefix, token: e.target.value})}} placeholder="Token do Discord" size="small"/>
                                </Stack>
                            </ListItemText>
                        </ListItem>
                        <Divider/>
                        <ListItem onClick={() => {props.saveConfig(config)}} button sx={{width: 100, mt: 2, borderRadius: 50, ml: -1}}>
                            <ListItemText>
                                <center><Typography style={{color: 'green'}}>Salvar</Typography></center>
                            </ListItemText>
                        </ListItem>
                    </List>
                )
        }
    }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => {setConfig(props.bot.config); props.handleClose()}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <PermanentDrawerLeft setScreen={setScreen} screen={screen} deleteBot={props.deleteBot} bot={props.bot} changeConfig={props.changeConfig}>
            <LoadScreen/>
        </PermanentDrawerLeft>
        </Box>
      </Modal>
    </div>
  );
}

const drawerWidth = 200;

function PermanentDrawerLeft(props) {

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
      open={false}
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
        <List>
            <ListItem>
                <ListItemIcon>
                    <SettingsIcon color="primary"/>
                </ListItemIcon>
                <ListItemText>Configurações</ListItemText>
            </ListItem>
        </List>
        <Divider/>
        <List>
        <ListItem onClick={() => {props.setScreen('basico')}} button>
                <ListItemIcon><SmartToyIcon color={props.screen == 'basico' ? 'primary' : 'default'}/></ListItemIcon>
                <ListItemText primary={'Básico'}/>
            </ListItem>
            <ListItem onClick={() => {props.setScreen('apis')}} button>
                <ListItemIcon><ApiIcon color={props.screen == 'apis' ? 'primary' : 'default'}/></ListItemIcon>
                <ListItemText primary={'APIs'}/>
            </ListItem>
        </List>
        <Divider/>
        <List>
            <ListItem button onClick={props.deleteBot}>
                <ListItemIcon><DeleteForeverIcon color="error"/></ListItemIcon>
                <ListItemText primary={'Deletar bot'}/>
            </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default'}}
      >
          {props.children}
      </Box>
    </Box>
  );
}