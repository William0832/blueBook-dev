import { NavLink } from "react-router-dom"
import { Typography, List, ListItem, Divider, ListItemIcon, ListItemText } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';
import { firstToUpper } from '../utils'
import Tree from './Tree'

export default function Sidebar ({ projects }) {
  const logoSize = 30
  const handelLinkClass = ({ isActive }) => {
    const linkClass = 'w-full p-2 flex duration-500 rounded-lg hover:bg-gray-200'
    return [
      linkClass,
      isActive ? 'router-link-active' : null
    ].join(' ')
  }

  return (
    <div id="sidebar" className="flex-col p-2 w-[240px] flex-shrink-0 border-r-2">
      <div className="flex items-center">
        <img
          className={`w-[${logoSize}px] h-[${logoSize}]px ml-2`}
          src="./logo.png" alt="FCOP logo"
        />
        <Typography variant="h6"
          sx={{ paddingLeft: 2, fontWeight: 700 }}>
          FCOP
        </Typography>
      </div>
      <nav className="mt-4">
        <Divider />
        <Tree data={projects} className="mt-2" />
      </nav>
    </div>
  )
}