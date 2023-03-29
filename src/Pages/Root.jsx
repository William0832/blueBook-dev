import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import useFlowStore from '../store/useFlowStore'
import { shallow } from 'zustand/shallow'

const sideBarWidth = 200
export default function Root () {
  const { loading, err, projects, fetchProjects, fetchCategories } = useFlowStore(
    (state) => ({
      loading: state.loading,
      err: state.err,
      projects: state.projects,
      fetchProjects: state.fetchProjects,
      fetchCategories: state.fetchCategories
    }),
    shallow
  )
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchProjects()
        ])
      } catch (err) {
        console.warn(err)
      }
    }
    fetchData()
  }, [])
  return (
    <div className="flex h-[100vh]">
      <Sidebar projects={projects} width={sideBarWidth} />
      <Outlet className="flex-grow" context={{ sideBarWidth }} />
    </div>
  )
}
