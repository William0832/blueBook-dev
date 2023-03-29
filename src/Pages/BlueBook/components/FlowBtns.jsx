import { Stack, Button, Menu, MenuItem } from '@mui/material'
import { ArrowDropDown } from '@mui/icons-material'
import { useState } from 'react'
import useFlowStore from '../../../store/useFlowStore'
import SettingsIcon from '@mui/icons-material/Settings'

export default function FlowHead ({ setOpenTabDialog, openCreateModal, isInteracted, setIsInteracted, categories, onSave }) {
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

      <Stack spacing={2}
        direction="row"
        sx={{ padding: 1 }}
      >
        <Button
          startIcon={<SettingsIcon />}
          onClick={() => setOpenTabDialog(() => true)}
          className="btn"
          disabled={isInteracted}
          variant="contained">
          編輯 tab
        </Button>
        <Button
          className="btn"
          disabled={isInteracted}
          variant={menuOpen ? 'contained' : 'outlined'}
          endIcon={<ArrowDropDown />}
          onClick={onOpenMenu}
        > 新增物件
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
          className="btn"
          disabled={isInteracted}
          size="small"
          variant="contained"
          onClick={() => onMenuBtnClick()}>
          編輯物件關聯
        </Button>
        <Button
          className="btn"
          sx={{ fontSize: 'px', paddingInline: 2, whiteSpace: "nowrap" }}
          size="small"
          variant={isInteracted ? 'outlined' : 'contained'}
          onClick={() => setIsInteracted((value) => !value)}
        > {isInteracted ? '互動模式' : '編輯模式'}
        </Button>
        <Button
          className="btn" variant="contained" onClick={onSave}>SAVE</Button>
      </Stack>
    </div>
  )

}