import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Drawer from './components/Drawer'
import CodeEditor from './components/CodeEditor'
import TabCodes from './components/TabCodes'
import CreateCommand from './components/CreateCommand'
import ConfigModal from './components/ConfigModal'
import './Bot.css'

const Bot = (props) => {

    const navigate = useNavigate()

    const [bot, setBot] = useState({nome: 'Carregando...', comandos: [], events: []});
    const [openedCodes, setOpenedCodes] = useState([]);
    const [code, setCode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [creatingCommand, setCreatingCommand] = useState(false);
    const [openConfigModal, setOpenConfigModal] = useState(false);
    const [previousCode, setPreviousCommand] = useState(false);

    useEffect(() => {
        props.api.getBot(props.api.getTransfer().id, response => {
            setBot(response);
        })
    }, [])

    const handleSelectCode = (arg, closing) => {
        setPreviousCommand(code);
        var has = openedCodes.find(c => c.nome === arg.nome);
        if (!has)
        {
            setOpenedCodes([...openedCodes, {nome: arg.nome, code: arg.code, type: arg.type}])
        }
        if (!closing)
        {
            setCode(arg);
        }
    }

    const saveCode = (arg) => {
        setCode(arg);
        var codigosAbertos = openedCodes;
        codigosAbertos.forEach(c => {
            if (c.nome === arg.nome) {
                c.code = arg.code;
            }
        });
        setOpenedCodes(codigosAbertos);
        if (arg.type === 'command') {
            var comandos = bot.comandos;
            comandos.forEach(c => {
                if (c.nome == arg.nome)
                {
                    c.code = arg.code;
                }
            })
            setBot({...bot, comandos: comandos});
            props.api.saveCommand({bot: bot.nome, comando: {nome: arg.nome, code: arg.code}}, response => {
            })
        } else {
            var eventos = bot.events;
            eventos.forEach(c => {
                if (c.nome == arg.nome)
                {
                    c.code = arg.code;
                }});
            setBot({...bot, events: eventos});
            props.api.saveEvent({bot: bot.nome, evento:{nome: arg.nome, code: arg.code, folder: arg.folder}}, () => {
            })
        }
    }

    const createCommand = (nome) => {
        props.api.createCommand({bot: bot.nome,nome}, response => {
            if (response.response) {
                props.api.getBot(props.api.getTransfer().id, response2 => {
                    setBot(response2);
                    var comando = response2.comandos.find(c => c.nome === nome);
                    setOpenedCodes([...openedCodes, {...comando, type: 'command'}]);
                    setCode(comando);
                })
            } else {
                alert('Ocorreu um erro...')
            }
        })
    }

    const deleteCommand = () => {
        props.api.deleteCommand({bot: bot.nome, nome: code.nome}, response => {
            if (response.response) {
                var comandos = bot.comandos;
                var events = bot.events;
                var index = comandos.findIndex(c => c.nome === code.nome);
                if (index > -1) {
                    comandos.splice(index, 1);
                } else {
                index = events.findIndex(c => c.nome === code.nome);
                events.splice(index, 1);
                }
                setBot({...bot, comandos: comandos, events: events});
                var ocIndex = openedCodes.findIndex(c => c.nome === code.nome);
                openedCodes.splice(ocIndex, 1);
                setOpenedCodes(openedCodes);
                setCode(openedCodes.length > 0 ? openedCodes[openedCodes.length-1] : false);
            } else {
                alert('Ocorreu um erro...')
            }
        })
    }

    const exportBot = () => {
        setLoading(true);
        props.api.exportBot({nome: bot.nome}, data => {
            var response = data.response;
            setLoading(false);
        })
    }

    const saveConfig = (newconfig) => {
        props.api.saveConfig({bot: bot.nome, config: newconfig}, data => {})
    }

    const deleteBot = () => {
        setLoading(true);
        props.api.deleteBot({bot: bot.nome}, data => {
            navigate('/');
        });
    }

    const saveApis = (apis) => {
        props.api.saveApis({bot: bot.nome, apis}, data => {
            props.api.getBot(props.api.getTransfer().id, response => {
                setOpenConfigModal(false);
                setBot(response);
            })
        })
    }

    const closeCode = (codigo) => {
        var {nome, type} = codigo;
        var codigosAbertos = [...openedCodes];
        var index = codigosAbertos.findIndex(c => c.nome === nome && c.type == type);
        codigosAbertos.splice(index, 1);
        setOpenedCodes(codigosAbertos);
        if (nome == code.nome && type == code.type) {
            setCode(previousCode)
        } else {
            setCode(code);
        }
        if (openedCodes.length == 1)
        {
            setCode(false);
        }
    }

    if (loading)
    {
        return CircularIndeterminate()
    } else {

    return (
        <div>
            <Drawer setOpenConfigModal={() => {setOpenConfigModal(true)}} exportBot={exportBot} setCreatingCommand={setCreatingCommand} handleSelectCode={handleSelectCode} bot={bot}>
                {bot.config ? <>
                    <CreateCommand createCommand={createCommand} setCreatingCommand={setCreatingCommand} creatingCommand={creatingCommand}/>
                    <TabCodes closeCode={closeCode} handleSelectCode={handleSelectCode} openedCodes={openedCodes} code={code}/>
                    <ConfigModal saveApis={saveApis} deleteBot={deleteBot} bot={bot} saveConfig={saveConfig} open={openConfigModal} handleClose={() => {setOpenConfigModal(false)}}/>
                </> : false}
                {code ? <CodeEditor deleteCommand={deleteCommand} saveCode={saveCode} code={code}/> : false}
            </Drawer>
        </div>
    )}
}

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router";
import { bottomNavigationActionClasses } from "@mui/material";
import { PromptProps } from "react-router-dom";
import { moveMessagePortToContext } from "worker_threads";

function CircularIndeterminate() {
  return (
    <div className="container">
        <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
        </div>
  );
}

export default Bot;