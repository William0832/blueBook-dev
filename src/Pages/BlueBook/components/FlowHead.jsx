import { Typography, Stack, Button, Menu, MenuItem } from '@mui/material'
import { ArrowDropDown } from '@mui/icons-material'
import { useState } from 'react'
import useFlowStore from '../../../store/useFlowStore';

export default function FlowHead ({ openCreateModal, isInteracted, setIsInteracted, categories, onSave }) {
  const blueprintName = useFlowStore((state) => state.blueprintName)
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl)
  const onOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const onMenuClose = () => {
    setAnchorEl(null)
  }
  const onMenuBtnClick = (category) => {
    openCreateModal(category)
    if (!category) return
    setAnchorEl(null)
  }
  return (
    <div className="border-b-2 flex relative items-center">
      <Typography variant=""
        sx={{
          textAlign: 'center',
          paddingBlock: 2,
          paddingInline: 2,
          minWidth: '150px'
        }}>
        {blueprintName}
      </Typography>

      <Stack spacing={2}
        direction="row"
        sx={{ height: 45 }}
      >
        <Button
          disabled={isInteracted}
          variant={menuOpen ? 'contained' : 'outlined'}
          endIcon={<ArrowDropDown />}
          onClick={onOpenMenu}
        > + 新增設備
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={onMenuClose}
        >
          {categories.map(c => (
            <MenuItem
              key={c.categoryId}
              onClick={() => onMenuBtnClick(c)}
            >
              <div> + {c.categoryName}</div>
            </MenuItem>
          ))}
        </Menu>

        <Button
          disabled={isInteracted}
          size="small"
          variant="contained"
          onClick={() => onMenuBtnClick()}>
          + 新增上下游關係
        </Button>
        <Button
          sx={{ fontSize: 'px', paddingInline: 2, whiteSpace: "nowrap" }}
          size="small"
          variant={isInteracted ? 'outlined' : 'contained'}
          onClick={() => setIsInteracted((value) => !value)}
        > {isInteracted ? '互動模式' : '編輯模式'}
        </Button>
        <Button variant="contained" onClick={onSave}>SAVE</Button>
      </Stack>
    </div>
  )

}