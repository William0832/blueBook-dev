import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useState, useEffect } from 'react'
export default function EdgeTypeSelector ({ setName, options, value, onChange }) {
  const [color, setColor] = useState('')
  const changeValueAndColor = (evt) => {
    const target = options.find(opt => opt.id === evt.target.value)
    setColor(() => target.color)
    setName(() => target.label)
    onChange(evt)
  }
  useEffect(() => {
    if (value && options) {
      const target = options.find(opt => opt.id === value)
      setColor(() => target.color)
    }
  }, [value])
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