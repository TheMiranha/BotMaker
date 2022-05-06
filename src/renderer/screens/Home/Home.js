import './Home.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router';

import { useState, useEffect } from 'react';

const Home = (props) => {

    const navigate = useNavigate();

    const [bots, setBots] = useState([]);

    useEffect(() => {
        props.api.getBots(bots => {
            setBots(bots);
        })
    },[])

    return (
        <div className="container">
            <h1>Bug?</h1>
            <List>
            {bots.map(bot => (
                
                    <ListItem key={bot} button onClick={() => {props.api.setTransfer({'id': bot});navigate('bot/' + bot)}}>
                        <ListItemIcon>
                            <SmartToyIcon/>
                        </ListItemIcon>
                        <ListItemText primary={bot}/>
                    </ListItem>
              

            ))}
                <Divider/>
                <Link style={{textDecoration: 'none'}} to="/criarBot">
                    <ListItem button>
                        <ListItemIcon>
                            <AddIcon color={'success'}/>
                        </ListItemIcon>
                        <ListItemText primary={'Criar bot'}/>
                    </ListItem>
                </Link>
            </List>
        </div>
    )
}

export default Home;