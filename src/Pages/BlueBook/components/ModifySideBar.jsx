import TextField from '@mui/material/TextField'
import { useEffect, useState, useMemo } from 'react'
import clsx from 'clsx'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, Stack, Button, IconButton, FormGroup, FormControlLabel, Switch } from '@mui/material'


function SwitchLabels ({ label, value, setValue }) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            color="error"
            checked={value}
            onChange={() => setValue(ov => !ov)}
          />
        }
        label={label} />
    </FormGroup>
  )
}
export default function ModifySideBar ({ target, modify, remove, setTarget }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(target?.data?.label || '')
  const [isAlert, setAlert] = useState(target?.data?.isAlert || false)

  const isStartNode = useMemo(() => target?.id === 'start', [target])

  useEffect(() => {
    if (!target) return
    setName(() => target.data?.label)
    setIsOpen(() => true)
  }, [target])
  return (
    <>
      <div className={clsx(
        'relative transition-all ease-in', {
        'w-[400px]': isOpen,
        'w-[20px]': !isOpen
      })}>

        <Stack
          sx={{ opacity: !!(target && isOpen) ? 1 : 0 }}
          spacing={2}
          className="m-2 ml-[20px] h-full overflow-hidden">
          <h4>{target?.data?.type}</h4>
          <TextField
            label="name"
            id="name"
            value={name}
            disabled={isStartNode || !target}
            onChange={(evt) => setName(evt.target.value)}
          />
          <SwitchLabels label={'警示狀態'} value={isAlert} setValue={setAlert} />
          <Stack direction="row" spacing={2} justifyContent="end">
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
              disabled={isStartNode || !target}
              onClick={() => modify(target, { name, isAlert })}
            >submit</Button>
            <Button
              size="small"
              onClick={() => remove(target)}
              variant="contained"
              color="error"
              disabled={isStartNode || !target}>remove</Button>
          </Stack>
        </Stack>

        <Box
          className="border-l-2"
          onClick={() => setIsOpen((open) => !open)}
          sx={{
            position: "absolute",
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