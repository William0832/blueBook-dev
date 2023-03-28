import { NavLink } from "react-router-dom"
import { Typography, List, ListItem } from '@mui/material'
import useFlowStore from "../store/useFlowStore"
export default function Sidebar ({ projects }) {
  const logoSize = 30
  const handelLinkClass = ({ isActive }) => {
    const linkClass = 'p-2 flex justify-center hover:bg-blue-100 duration-500 rounded-lg'
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
        <Typography align="center">BlueBook</Typography>
        <List>
          {projects.map((p, i) => (
            <ListItem key={p.projId}>
              <List >
                <Typography sx={{ p: 1 }} >{p.projName || `project ${i + 1}`}
                </Typography>
                {p.blueprints.map((bp, j) => (
                  <ListItem key={bp.bpId}>
                    <NavLink
                      to={`blueBook/${p.projId}/${bp.bpId}`}
                      className={handelLinkClass}>
                      {bp.bpName || `bp ${j + 1}`}
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