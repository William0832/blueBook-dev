import { NavLink } from "react-router-dom"
import { Typography, List, ListItem, Divider, ListItemIcon, ListItemText } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';
import { firstToUpper } from '../utils'
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
    <div id="sidebar" className="flex-col p-2 w-[200px] flex-shrink-0 border-r-2">
      <div className="flex items-center justify-around">
        <img
          className={`w-[${logoSize}px] h-[${logoSize}]px`}
          src="./logo.png" alt="FCOP logo"
        />
        <Typography variant="h6">FCOP</Typography>
      </div>

      <nav className="mt-4">
        {/* <Typography align="left" sx={{ pl: 1 }} variant="h5">BlueBook</Typography> */}
        <Divider />
        <List>
          {projects.map((p, i) => (
            <ListItem key={p.projId} disablePadding divider>
              <List sx={{ width: '100%', pl: 1, pb: 1 }}>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ justifyContent: 'center' }}>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText>{
                    p.projName ||
                    firstToUpper(`project ${i + 1}`)
                  }</ListItemText>
                </ListItem>
                {p.blueprints.map((bp, j) => (
                  <ListItem disablePadding key={bp.bpId} sx={{ p: 1, pr: 2 }}>
                    <NavLink
                      to={`blueBook/${p.projId}/${bp.bpId}`}
                      className={handelLinkClass}>
                      <Typography variant="body2">
                        {bp.bpName || `bp ${j + 1}`}
                      </Typography>
                    </NavLink>
                  </ListItem>
                ))}
              </List>
            </ListItem>

          ))}
        </List>
      </nav>
    </div>
  )
}