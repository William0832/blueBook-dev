// import { v4 as uid } from 'uuid'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import { Stack, Typography } from '@mui/material'
import FlowTabs from './components/FlowTabs'
import FlowPanel from './components/FlowPanel'
import FlowBtns from './components/FlowBtns'
import DialogTabName from './components/DialogTabName'
import useFlowStore from '../../store/useFlowStore'
import { shallow } from 'zustand/shallow'
import LoadingPage from '../../components/LoadingPage'
import { useOutletContext } from 'react-router-dom'

export default function BlueBook () {
  const { sideBarWidth } = useOutletContext()
  const { pId, bpId } = useParams()
  const [openTabDialog, setOpenTabDialog] = useState(false)
  const { loading, err, blueprintName, categories, fetchBlueprint, createBlueprint, save, tabIndex, setTabIndex } = useFlowStore(
    (state) => ({
      ...state
    }),
    shallow
  )
  // const blueprint = useFlowStore(state => state.blueprint)
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false)
  const [nodeType, setNodeType] = useState(null)
  const [edgeDialogOpen, setEdgeDialogOpen] = useState(false)
  const [isInteracted, setIsInteracted] = useState(false)
  const [gridOpen, setGridOpen] = useState(true)


  function openCreateModal (category) {
    if (category) {
      setNodeType((ov) => category)
      setNodeDialogOpen(() => true)
      return
    }
    setEdgeDialogOpen(() => true)
  }

  async function addNewTab () {
    await createBlueprint()
  }
  async function onSave () {
    await save({})
  }
  // init fetch bp
  useEffect(() => {
    const fetchData = async () => {
      try {

        if (!pId || !bpId) return
        setTabIndex(0)
        await fetchBlueprint({ pId, bpId })
      } catch (err) {
        console.warn(err)
      }
    }
    fetchData()
  }, [bpId])

  return (
    <>
      <LoadingPage loading={loading} />
      <Stack className="w-full">
        <Typography
          sx={{
            paddingInline: 2,
            paddingTop: '.5rem',
            fontSize: '1rem'
          }}>
          {blueprintName}
        </Typography>
        <FlowTabs
          sideBarWidth={sideBarWidth}
          addNewTab={addNewTab}
          isInteracted={isInteracted}
        />
        <FlowBtns
          categories={categories}
          isInteracted={isInteracted}
          openCreateModal={openCreateModal}
          setIsInteracted={setIsInteracted}
          onSave={onSave}
          setOpenTabDialog={setOpenTabDialog}
        />
        <FlowPanel
          tabIndex={tabIndex}
          isInteracted={isInteracted}
          nodeType={nodeType}
          nodeDialogOpen={nodeDialogOpen}
          setNodeDialogOpen={setNodeDialogOpen}
          edgeDialogOpen={edgeDialogOpen}
          setEdgeDialogOpen={setEdgeDialogOpen}
          gridOpen={gridOpen}
          setGridOpen={setGridOpen}
        />
      </Stack>
      <DialogTabName open={openTabDialog} setOpen={setOpenTabDialog} />
    </>
  )
}