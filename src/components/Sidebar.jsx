import { NavLink } from "react-router-dom"
import { Typography, List, ListItem } from '@mui/material'
export default function Sidebar () {
  const logoSize = 30

  const handelLinkClass = ({ isActive }) => {
    const linkClass = 'px-3 p-2 hover:bg-blue-100 duration-500 rounded-lg'
    return [
      linkClass,
      isActive ? 'router-link-active' : null
    ].join(' ')
  }

  return (
    <div id="sidebar" className="flex-col p-2 w-[200px] border-r-2">
      <div className="flex items-center justify-around">
        <img
          className={`w-[${logoSize}px] h-[${logoSize}]px`}
          src="./logo.png" alt="FCOP logo"
        />
        <Typography variant="h6">FCOP</Typography>
      </div>

      <nav className="mt-4">
        <List>
          <ListItem>
            <NavLink to={'blueBook'} className={handelLinkClass}>
              <Typography variant="h6">BlueBook</Typography>
            </NavLink>
          </ListItem>
        </List>
      </nav>
    </div>
  )
}