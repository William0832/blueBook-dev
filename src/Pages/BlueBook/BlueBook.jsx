// import { v4 as uid } from 'uuid'

import { useState, useMemo, useCallback } from 'react'
import { Stack } from '@mui/material'
import FlowTabs from './components/FlowTabs'
import FlowPanel from './components/FlowPanel'
import { defaultFlowData } from './initState'
import FlowHead from './components/FlowHead'

export default function BlueBook () {
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false)
  const [nodeType, setNodeType] = useState(null)
  const [edgeDialogOpen, setEdgeDialogOpen] = useState(false)

  const [flowData, setFlowData] = useState(defaultFlowData)
  const [tabIndex, setTabIndex] = useState(0)
  const [isInteracted, setIsInteracted] = useState(false)
  const [gridOpen, setGridOpen] = useState(true)
  const tabs = useMemo(() => flowData.map(data => ({
    id: data.id,
    label: data.tabLabel
  })))

  function openCreateModal (category) {
    if (category) {
      console.log(category)
      setNodeType((ov) => category)
      setNodeDialogOpen(() => true)
      return
    }
    setEdgeDialogOpen(() => true)
  }
  function addFlowData (id) {
    setFlowData((data) => {
      const newId = id || data.length + 1
      const newData = {
        id: newId,
        tabLabel: `tab${newId}`,
        nodes: [],
        edges: []
      }
      return data.concat(newData)
    })
  }
  function addNewTab () {
    addFlowData()
    setTabIndex(() => tabs.length)
  }
  return (
    <Stack className="w-full">
      <FlowHead
        isInteracted={isInteracted}
        openCreateModal={openCreateModal}
        setIsInteracted={setIsInteracted}
      />

      <FlowTabs
        tabs={tabs}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        addNewTab={addNewTab}
        isInteracted={isInteracted}
      />
      <FlowPanel
        tabIndex={tabIndex}
        flowData={flowData}
        setFlowData={setFlowData}
        isInteracted={isInteracted}
        nodeType={nodeType}
        nodeDialogOpen={nodeDialogOpen}
        setNodeDialogOpen={setNodeDialogOpen}
        gridOpen={gridOpen}
        setGridOpen={setGridOpen}
      />
    </Stack>
  )
}