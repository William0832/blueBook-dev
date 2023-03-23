import { useState, useEffect } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

import Stack from '@mui/material/Stack'

import DialogNodeAddBtns from './DialogNodeAddBtns'
// const EdgeInputs = ({ nodes, sourceId, setSourceId, targetId, setTargetId }) => {
//   const onChange = (evt, type) => {
//     const { value: id } = evt.target
//     if (id === '' || id == null) return
//     type === 'source'
//       ? setSourceId(() => id)
//       : setTargetId(() => id)
//   }
//   return (
//     <>
//       <FormControl fullWidth>
//         <InputLabel>Source</InputLabel>
//         <Select
//           label="Source"
//           id="source"
//           value={sourceId}
//           onChange={(evt) => onChange(evt, 'source')}>
//           {nodes
//             .filter(e => e.id !== targetId)
//             .map(e => (
//               <MenuItem key={e.id} value={e.id}>
//                 {e.data.label}
//               </MenuItem>
//             ))
//           }
//         </Select>
//       </FormControl>
//       <FormControl fullWidth>
//         <InputLabel>Target</InputLabel>
//         <Select
//           value={targetId}
//           label="Target"
//           id="target"
//           onChange={(evt) => onChange(evt, 'target')}>
//           {nodes
//             .filter(e => e.id !== sourceId)
//             .map(e => (
//               <MenuItem key={e.id} value={e.id}>
//                 {e.data.label}
//               </MenuItem>
//             ))
//           }
//         </Select>
//       </FormControl>
//     </>
//   )
// }

export default function NodeDialog ({ open, setOpen, category, createNode }) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState()

  useEffect(() => {
    if (open === false) {
      setName(() => '')
      setTarget(() => null)
    }
  }, [open])

  useEffect(() => {
    if (target) {
      setName((oldName) => target.objectName)
    }
  }, [target])
  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = () => {
    if (name === '' || name == null) {
      alert('Plz input Name!')
      return
    }
    if (target == null) {
      alert('Plz select target!')
      return
    }
    createNode({ category, name, target, isAlert: false })
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          + {category?.categoryName}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            <Box>
              <p className="mb-2">選擇設備：</p>
              {!!category?.objectList &&
                <DialogNodeAddBtns
                  list={category.objectList}
                  target={target}
                  setTarget={setTarget}
                />
              }
            </Box>
            <TextField
              id="name"
              label="設備名稱"
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