import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { Button, Stack, TextField, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {useNavigate} from 'react-router-dom';

const CreateBot = (props) => {
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [prefix, setPrefix] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (nome.trim().length > 0 && prefix.trim().length > 0 && token.trim().length > 0) {
            setLoading(true)
            props.api.createBot({nome, prefix, token}, (x) => {
                if(x.response) {
                    setLoading(false);
                    navigate('/');
                } else {
                    setLoading(false);
                    setError('Ocorreu um erro...');
                }
            })
        } else {
            setError('Preencha todos os campos')
        }
    }

    if (loading) {
        return (
            <div className="container">
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            </div>
        )
    } else {
        return (
            <div className="container">
                <h1>Configurações iniciais</h1>
                {error ? <Typography color='error' sx={{mb: 1}}>
                    Preencha todos os campos
                </Typography> : false}
                <TextField value={nome} onChange={(e) => {setNome(e.target.value)}} label="Nome do bot" required/>
                <TextField value={prefix} onChange={(e) => {setPrefix(e.target.value)}} label="Prefix" sx={{mt: 1}} required/>
                <TextField value={token} onChange={(e) => {setToken(e.target.value)}} label="Token" sx={{mt: 1}} required/>
                <Stack direction={'row'}>
                    <Link to="/" style={{textDecoration: 'none'}}>
                        <Button sx={{mt: 2, mr: 1}}>
                            <ArrowBackIcon sx={{mr: 2}}/>
                            Ver bots
                        </Button>
                    </Link>
                        <Button onClick={handleSubmit} color="success" sx={{mt: 2, ml: 1}}>
                            Criar bot
                            <AddIcon sx={{ml: 2}}/>
                        </Button>
                </Stack>
            </div>
        )
    }
}

export default CreateBot;