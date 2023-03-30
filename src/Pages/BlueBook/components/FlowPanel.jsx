import { useEffect } from 'react'
import GridOnIcon from '@mui/icons-material/GridOn'

import ReactFlow, {
  Background, Controls, ControlButton,
  ReactFlowProvider, useReactFlow,
  ConnectionMode
} from 'reactflow'

import { Stack } from '@mui/material'
import ModifySideBar from './ModifySideBar'
import DialogNode from './DialogNode'
import DialogEdge from './DialogEdge'

import {
  edgeTypes,
  nodeTypes, edgeOptions, connectionLineStyle
} from '../initState.js'

import 'reactflow/dist/style.css'
import '../style.css'
import useFlowStore from '../../../store/useFlowStore';
import { shallow } from 'zustand/shallow'


export default function FlowPanel ({
  tabIndex, nodeDialogOpen, setNodeDialogOpen, nodeType,
  gridOpen, setGridOpen, isInteracted, edgeDialogOpen, setEdgeDialogOpen,
}) {
  const { bpId, pId, nodes, edges, setTabId, tabs, remove, target, setTarget, modify, preConnect, setPreConnect, fetchBlueprint } = useFlowStore((state) => ({
    ...state
  }), shallow)


  const onConnect = (connection) => {
    if (isInteracted) return
    if (connection.source === connection.target) {
      alert('請選其他設備的連接點')
      return
    }
    setEdgeDialogOpen(() => true)
    setPreConnect(connection)
  }
  const getDownStreams = (edges, targetId, visitedEdgeIds = []) => {
    const downStreamNodes = []
    const downStreamEdges = []
    edges = edges.filter(edge => !visitedEdgeIds.includes(edge.id))
    edges.forEach(edge => {
      if (edge.source === targetId) {
        downStreamEdges.push(edge.id)
        downStreamNodes.push(edge.target)
        visitedEdgeIds.push(edge.id)
        const { nodes: theNodes, edges: theEdges } = getDownStreams(
          edges, edge.target, visitedEdgeIds
        )
        downStreamNodes.push(
          ...theNodes
        )
        downStreamEdges.push(...theEdges)

      }
    })
    return { nodes: downStreamNodes, edges: downStreamEdges }
  }
  const alertDownStreamNodes = (target, isAlert = true) => {

    const theNodes = [...new Set([
      target.id,
      ...getDownStreams(edges, target.id).nodes])
    ]
    const theEdges = [...new Set([
      ...getDownStreams(edges, target.id).edges])
    ]
    theNodes.forEach(id => {
      const target = nodes.find(node => node.id === id)
      if (target) {
        modify(target, { isAlert })
      }
    })
    theEdges.forEach(id => {
      const target = edges.find(edge => edge.id === id)
      if (target) {
        modify(target, { isAlert, name: target.label })
      }
    })
  }
  useEffect(() => {
    const fetchData = async () => {
      await fetchBlueprint({ bpId, pId })
    }
    setTarget(null)
    if (tabs.length > 0) {
      const { tabId } = tabs[tabIndex]
      if (tabId == null) return
      setTabId(tabId)
      fetchData({})
    }
  }, [tabIndex])

  return (
    <Stack
      direction="row"
      style={{ width: '100%', height: '100%' }}
    >
      <ReactFlowProvider>
        <Flow
          onConnect={onConnect}
          clickTarget={(node) => setTarget(node)}
          nodeType={nodeType}
          nodeDialogOpen={nodeDialogOpen}
          setNodeDialogOpen={setNodeDialogOpen}
          edgeDialogOpen={edgeDialogOpen}
          setEdgeDialogOpen={setEdgeDialogOpen}
          gridOpen={gridOpen}
          setGridOpen={setGridOpen}
          preConnect={preConnect}
          setPreConnect={setPreConnect}
        />
      </ReactFlowProvider>
      <ModifySideBar
        edgeTypes={edgeTypes}
        // target={target}
        modify={modify}
        remove={remove}
        // setTarget={setTarget}
        isInteracted={isInteracted}
        alertDownStreamNodes={alertDownStreamNodes}
      />
    </Stack>
  )
}

function Flow ({
  onConnect,
  clickTarget, nodeType, nodeDialogOpen, setNodeDialogOpen, gridOpen, setGridOpen,
  edgeDialogOpen, setEdgeDialogOpen,
}) {
  const { nodes, edges, onNodesChange, onEdgesChange, createNode, createEdge,
    preConnect } = useFlowStore((state) => ({
      ...state
    }), shallow)

  const rf = useReactFlow()

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={(evt, target) => clickTarget(target)}
      onEdgeClick={(evt, target) => clickTarget(target)}
      connectionMode={ConnectionMode.Loose}
      className="transition"
      nodeTypes={nodeTypes}
      defaultEdgeOptions={edgeOptions}
      connectionLineStyle={connectionLineStyle}
    >
      <Controls style={{ fill: "#fff", color: '#fff' }}>
        <ControlButton
          onClick={() => setGridOpen((value => !value))}>
          <GridOnIcon />
        </ControlButton>
      </Controls>
      {/* <MiniMap zoomable pannable /> */}
      {gridOpen ? <Background className="bg-gray-800" /> : null}
      <DialogNode
        open={nodeDialogOpen}
        setOpen={setNodeDialogOpen}
        category={nodeType}
        createNode={createNode}
      />
      <DialogEdge
        open={edgeDialogOpen}
        setOpen={setEdgeDialogOpen}
        edgeTypes={edgeTypes}
        nodes={nodes}
        preConnect={preConnect}
        createEdge={createEdge}
        rf={rf}
      />
    </ReactFlow>
  )
}
