import { useState, useEffect } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import Stack from '@mui/material/Stack'
import useFlowStore from '../../../store/useFlowStore'

export default function DialogTabName ({ open, setOpen }) {
  const label = "Tab 名稱"
  const title = `編輯 ${label}`

  const [name, setName] = useState('')
  const save = useFlowStore((state) => state.save)

  useEffect(() => {
    if (open === false) {
      setName(() => '')
    }
  }, [open])

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async () => {
    if (name === '' || name == null) {
      alert('Plz input Name!')
      return
    }
    await save({ title: name })
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          + {title}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            <TextField
              id="name"
              label={label}
              variant="standard"
              placeholder="Enter node name"
              value={name}
              onChange={(evt) => { setName(evt.target.value) }} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="error">Cancel</Button>
          <Button onClick={onSubmit} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}