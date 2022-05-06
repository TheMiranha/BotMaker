import React, { useState } from 'react'

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { IconButton, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { oneDark } from '@codemirror/theme-one-dark';

const CodeEditor = (props) => {

    const [code, setCode] = useState(props.code);

  const onChange = (value, viewUpdate) => {
    setCode({...code, code: value})
  }

  return (
   <>
    <div className='container2'>
    <CodeMirror
      value={props.code.code}
      height="78vh"
      theme={oneDark}
      extensions={[javascript({ jsx: false })]}
      onChange={onChange}
    />
    </div>
          <Stack direction={'row'} sx={{mt: 2}}>
          <IconButton onClick={() => {
            props.saveCode(code)
          }}>
              <SaveIcon color={'success'}/>
          </IconButton>
          {props.code.type == 'command' ? <IconButton onClick={props.deleteCommand}>
              <DeleteForeverIcon color={'error'}/>
          </IconButton> : false}
        </Stack>
   </>
  )
}

export default CodeEditor