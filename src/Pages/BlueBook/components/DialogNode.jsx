import { useState, useEffect } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

import { Stack, FormGroup, FormControlLabel, Switch } from '@mui/material/'

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
  );
}
export default function NodeDialog ({ open, setOpen, category, createNode }) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState()
  const [isAlert, setIsAlert] = useState(false)
  useEffect(() => {
    if (open === false) {
      setIsAlert(() => false)
      setTarget(() => null)
    }
  }, [open])
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
    createNode({ category, name, target, isAlert })
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
            <TextField
              id="name"
              label="name"
              variant="standard"
              placeholder="Enter node name"
              onChange={(evt) => { setName(evt.target.value) }} />
            <SwitchLabels label={'Alert'} value={isAlert} setValue={setIsAlert} />
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