import { Box, IconButton, Stack, Tab, Tabs, tabsClasses } from "@mui/material";
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const TabCodes = (props) => {

  const [closing, setClosing] = React.useState(false);

  const handleChange = (event, newValue) => {
    props.handleSelectCode(props.openedCodes[newValue], closing);
    setClosing(false)
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: '80vw',
        bgcolor: 'background.paper',
      }}
      style={{borderBottom: '1px solid #e0e0e0'}}
    >
      <Tabs
        value={props.openedCodes.findIndex(c => c.nome === props.code.nome) > -1 ? props.openedCodes.findIndex(c => c.nome === props.code.nome) : 0
        }
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {props.openedCodes.map(command => (
            <Tab label={
            <Stack direction={'row'}>
              {command.nome + '.js'}
              <IconButton onClick={() => {setClosing(true); props.closeCode(command);}} sx={{mt: -1.5, ml: 1}}>
                <CloseIcon color="error" />
              </IconButton>
            </Stack>} key={command.nome + '.js_command'}/>
        ))}
      </Tabs>
    </Box>
  );
}

export default TabCodes;