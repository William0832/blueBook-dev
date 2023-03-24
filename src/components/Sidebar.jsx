import { Link } from "react-router-dom"
import { Typography, List, ListItem } from '@mui/material'
export default function Sidebar () {
  const logoSize = 30

  return (
    <div id="sidebar" className="flex-col p-2 w-[200px] border-r-2">
      <div className="flex items-center justify-around">
        <img
          className={`w-[${logoSize}px] h-[${logoSize}]px`}
          src="./logo.png" alt="FCOP logo"
        />
        <Typography variant="h6">FCOP</Typography>
      </div>

      <nav class>
        <List>
          <ListItem>
            <Link to={'blueBook'}>
              <Typography variant="h6">BlueBook</Typography>
            </Link>
          </ListItem>
        </List>
      </nav>
    </div>
  )
}