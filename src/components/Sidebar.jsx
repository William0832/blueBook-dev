import { Link } from "react-router-dom"
export default function Sidebar () {
  return (
    <div id="sidebar" className="flex-col p-2 w-[200px] border-r-2">
      <h1>FCOP</h1>
      <nav>
        <ul>
          <li>
            <Link to={'blueBook'}>BlueBook</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}