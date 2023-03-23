import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
export default function Root () {
  return (
    <div className="flex h-[100vh]">
      <Sidebar />
      <Outlet className="flex-grow" />
    </div>
  )
}
