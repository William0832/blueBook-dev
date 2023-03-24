import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, List, ListItem, ListItemText, Stack, Button, IconButton, FormGroup, FormControlLabel, Switch } from '@mui/material'

function SwitchLabels ({ label, value, setValue, updateNode }) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            color="error"
            checked={value}
            onClick={() => setValue(ov => !ov)}
          />
        }
        label={label} />
    </FormGroup>
  )
}

function MetaDataList ({ data }) {
  if (data == null) return null
  return (
    <List>
      {data.map((e, i) => (
        <ListItem key={i}>
          <ListItemText primary={e?.itemName} secondary={e?.itemValue} />
        </ListItem>))
      }
    </List>

  )
}

export default function ModifySideBar ({ target, modify, remove, setTarget, isInteracted }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(target?.data?.label || '')
  const [isAlert, setIsAlert] = useState(target?.data?.isAlert || false)

  const onChangeName = (evt) => {
    setName(() => evt.target.value)
  }

  const updateNode = () => {
    modify(target, { name, isAlert })
  }

  const removeNode = () => {
    remove(target)
    setTarget(() => null)
  }

  useEffect(() => {
    if (!target) {
      setIsAlert(() => false)
      setName(() => '')
      setIsOpen(() => false)
      return
    }
    setIsAlert(() => target.data?.isAlert)
    setName(() => target.data?.label)
    setIsOpen(() => true)
  }, [target])
  return (
    <>
      <div className={clsx(
        'relative transition-all ease-in', {
        'w-[400px]': isOpen,
        'w-[20px]': !isOpen,
      })}>

        <Stack
          sx={{ opacity: !!(target && isOpen) ? 1 : 0 }}
          spacing={2}
          className=" mx-[20px] pt-2 h-full overflow-hidden">
          <h4>{target?.data?.type}</h4>
          <TextField
            label="name"
            id="name"
            value={name}
            disabled={!target || isInteracted}
            onChange={onChangeName}
          />
          <SwitchLabels label={'警示狀態'} value={isAlert} setValue={setIsAlert} updateNode={updateNode} />
          <MetaDataList data={target?.data?.metadata} />
          <Button
            size="small"
            variant="contained"
            disabled={!target}
            color="error"
          >下游全面警示</Button>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              size="small"
              variant="contained"
              disabled={!target}
              color="inherit"
              onClick={() => setTarget(() => null)}
            >Cancel</Button>

            <Button
              size="small"
              variant="contained"
              disabled={!target}
              onClick={updateNode}
            >submit</Button>
            <Button
              size="small"
              onClick={removeNode}
              variant="contained"
              color="error"
              disabled={isInteracted || !target}
            >remove</Button>
          </Stack>
        </Stack>

        <Box
          className="border-l-2"
          onClick={() => setIsOpen((open) => !open)}
          sx={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            width: '20px',
            height: '100%',
            '&:hover': {
              borderLeft: '3px solid #1876D1'
            }
          }}>
        </Box>
        <IconButton
          onClick={() => setIsOpen((open) => !open)}
          sx={{
            padding: .6,
            color: '#aaa',
            bgcolor: 'white',
            border: '2px solid',
            position: 'absolute',
            top: '50%',
            left: '-13px',
            transition: 'transform .2s',
            transform: isOpen ? 'rotate(0)' : 'rotate(180deg)',
            '&:hover': {
              color: '#fff',
              bgcolor: '#1876D1',
              border: '2px solid #fff',

            }
          }}>
          <ArrowForwardIosIcon
            sx={{
              fontSize: '12px',
            }}
          />
        </IconButton>
      </div>
    </>
  )
}