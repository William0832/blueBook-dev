import { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { Stack, InputLabel, MenuItem, FormControl, Select } from '@mui/material/'

const EdgeInputs = ({ nodes, refSource, refTarget, sourceId, setSourceId, targetId, setTargetId }) => {
  const onChange = (evt, type) => {
    const { value: id } = evt.target
    if (id === '' || id == null) return
    type === 'source'
      ? setSourceId(() => id)
      : setTargetId(() => id)
  }
  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Source</InputLabel>
        <Select
          label="Source"
          id="source"
          value={sourceId}
          onChange={(evt) => onChange(evt, 'source')}>
          {nodes
            .filter(e => e.id !== targetId)
            .map(e => (
              <MenuItem key={e.id} value={e.id}>
                {e.data.label}
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Target</InputLabel>
        <Select
          value={targetId}
          label="Target"
          id="target"
          onChange={(evt) => onChange(evt, 'target')}>
          {nodes
            .filter(e => e.id !== sourceId)
            .map(e => (
              <MenuItem key={e.id} value={e.id}>
                {e.data.label}
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </>
  )
}
export default function NodeDialog ({
  open, setOpen, type, isEdge = false, nodes, createNode, createEdge }) {
  const [name, setName] = useState('')
  const [sourceId, setSourceId] = useState('')
  const [targetId, setTargetId] = useState('')

  const handleClose = () => setOpen(false)
  const onSubmit = () => {
    if (isEdge) {
      if (sourceId === '' || sourceId == null) {
        alert('Plz input Source!')
        return
      }
      if (targetId === '' || targetId == null) {
        alert('Plz input Target!')
        return
      }
      createEdge(sourceId, targetId, name)
      setOpen(false)
      setName(() => '')
      return
    }
    if (name === '' || name == null) {
      alert('Plz input Name!')
      return
    }
    createNode(type, name)
    setName(() => '')
    setOpen(false)
  }
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">
          {isEdge
            ? 'Add edge'
            : `Add ${type?.toUpperCase()} node`
          }
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              id="name"
              label="name"
              variant="standard"
              placeholder={isEdge ? 'Enter edge name' : 'Enter node name'}
              onChange={(evt) => { setName(evt.target.value) }} />
            {isEdge
              ? <EdgeInputs
                nodes={nodes}
                sourceId={sourceId}
                targetId={targetId}
                setSourceId={setSourceId}
                setTargetId={setTargetId}
              />
              : null}
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