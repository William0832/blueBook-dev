import { useCallback, useState, useEffect } from 'react'
import { useReactFlow } from 'reactflow'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { Stack, InputLabel, MenuItem, FormControl, Select } from '@mui/material/'
// import { edgeOptions } from '../initState'

export default function EdgeDialog ({ open, setOpen, edgeTypes, nodes, createEdge, preConnect }) {
  const [name, setName] = useState('')
  const [edgeType, setEdgeType] = useState('')
  const [sourceId, setSourceId] = useState('')
  const [targetId, setTargetId] = useState('')
  const [strokeSize, setStrokeSize] = useState(1)

  useEffect(() => {
    // close init state
    if (!open) {
      setName(() => '')
      setEdgeType(() => '')
      setSourceId(() => '')
      setTargetId(() => '')
      return
    }
    if (open && nodes.length < 2) {
      alert('請先新增2個設備')
      setOpen(() => false)
    }
  }, [open])

  const handleClose = () => setOpen(() => false)
  const onSubmit = () => {
    if (edgeType === '' || edgeType == null) {
      alert('Plz select edge type!')
      return
    }
    // create
    if (preConnect) {
      console.log(preConnect)
      const { sourceHandle, targetHandle } = preConnect
      const payload = {
        sourceHandle,
        targetHandle,
        label: name,
        source: sourceId,
        target: targetId,
        edgeType
      }
      createEdge(payload)
      setOpen(() => false)
      return
    }
    // update
    const sourceHandle = ''
    const targetHandle = ''
    const payload = {
      label: name,
      sourceHandle,
      targetHandle,
      source: sourceId,
      target: targetId,
      edgeType
    }
    createEdge(payload)
    setOpen(() => false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title">+ Edge
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            id="name"
            label="name"
            variant="standard"
            placeholder="Enter Edge name"
            value={name}
            onChange={(evt) => setName(evt.target.value)} />
          <EdgeTypeSelector
            setName={setName}
            options={edgeTypes}
            value={edgeType}
            onChange={(evt) => setEdgeType(evt.target.value)} />
          <EdgeLinkInputs
            preConnect={preConnect}
            nodes={nodes}
            sourceId={sourceId}
            targetId={targetId}
            setSourceId={setSourceId}
            setTargetId={setTargetId}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
        <Button onClick={onSubmit} autoFocus>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EdgeLinkInputs ({ preConnect, nodes, sourceId, setSourceId, targetId, setTargetId }) {
  const onChange = (evt, type) => {
    const { value: id } = evt.target
    if (id === '' || id == null) return
    type === 'source'
      ? setSourceId(() => id)
      : setTargetId(() => id)
  }
  useEffect(() => {
    if (preConnect?.source && preConnect?.target) {
      setTargetId(() => preConnect?.target)
      setSourceId(() => preConnect?.source)
    }
  }, [preConnect])
  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Source</InputLabel>
        <Select
          label="Source"
          id="source"
          value={preConnect?.source || sourceId || ''}
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
          value={preConnect?.target || targetId || ''}
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

function EdgeTypeSelector ({ setName, options, value, onChange }) {
  const [color, setColor] = useState('')
  const changeValueAndColor = (evt) => {
    const target = options.find(opt => opt.id === evt.target.value)
    setColor(() => target.color)
    setName(() => target.label)
    onChange(evt)
  }
  return (
    <FormControl fullWidth>
      <InputLabel id="edge-type-select-label">Type</InputLabel>
      <Select
        sx={{ color }}
        labelId="edge-type-select-label"
        id="edge-type-select"
        value={value}
        label="Type"
        onChange={changeValueAndColor}
      >
        {options.map(opt => (
          <MenuItem key={opt.id} value={opt.id} sx={{ color: opt.color }}>
            {opt.label}
          </MenuItem>))}
      </Select>
    </FormControl>
  )
}