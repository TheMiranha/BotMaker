import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {

    const [nome, setNome] = React.useState('');
    const [error, setError] = React.useState(false);

  const handleClose = () => {
      setNome('')
      setError(false);
    props.setCreatingCommand(false);
  }

  const submit = () => {
      if (nome.indexOf(' ') > -1)
      {
        setError('Não pode haver espaços')
      } else {
        props.createCommand(nome);
        props.setCreatingCommand(false);
      }
  }

  return (
    <div>
      <Modal
        open={props.creatingCommand}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{ml: 1}}id="modal-modal-title" variant="h6" component="h6">
              Digite um nome
          </Typography>
          {error ? <Typography sx={{ml: 1, mt: 1}} color="error" id="modal-modal-title" component="h2">
              {error}
          </Typography> : false}
          <List>
            <ListItem>
                <TextField value={nome} onChange={(e) => {setNome(e.target.value)}}sx={{mt: 2, ml: -1}} label="Comando"/>
            </ListItem>
            <Button onClick={submit} color="secondary">
                <AddIcon/>
                Criar
            </Button>
          </List>
        </Box>
      </Modal>
    </div>
  );
}
