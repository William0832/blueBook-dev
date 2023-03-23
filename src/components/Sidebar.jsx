export default function Sidebar () {
  return (
    <div id="sidebar" className="flex-col p-2 w-[200px] border-r-2">
      <h1>FCOP</h1>
      <nav>
        <ul>
          <li>
            <a href={`/blueBook`}>BlueBook</a>
          </li>
        </ul>
      </nav>
    </div>
  )
}