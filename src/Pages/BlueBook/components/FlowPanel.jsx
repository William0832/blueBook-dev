import { v4 as uid } from 'uuid'
import { useState, useCallback, useEffect, useMemo } from 'react'
import GridOnIcon from '@mui/icons-material/GridOn';

import ReactFlow, {
  addEdge, Panel, Background, Controls, MiniMap, ControlButton,
  ReactFlowProvider, useReactFlow,
  ConnectionMode, applyNodeChanges
} from 'reactflow'

import { Stack } from '@mui/material'

import ModifySideBar from './ModifySideBar'
import NodeDialog from './DialogNode'

import {
  nodeTypes, edgeOptions, connectionLineStyle
} from '../initState.js'
import { getNodeStyle } from '../utils'

import 'reactflow/dist/style.css'
import '../style.css'
import { color } from '@mui/system';

export default function FlowPanel ({
  tabIndex, flowData, setFlowData, nodeDialogOpen, setNodeDialogOpen, nodeType,
  gridOpen, setGridOpen
}) {

  const defaultNodes = useMemo(
    () => flowData[tabIndex].nodes,
    [tabIndex]
  )
  const defaultEdges = useMemo(
    () => flowData[tabIndex].edges,
    [tabIndex]
  )

  const [nodes, setNodes] = useState(
    defaultNodes.map(e => ({
      ...e, style: getNodeStyle(e.data.type)
    })))
  const [edges, setEdges] = useState(defaultEdges)

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds))
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds))
  )
  const onConnect = useCallback(
    (connection) => {
      const res = prompt('連接名稱(可略過)', '')
      console.log(connection)
      if (res == null) return
      return setEdges((eds) => addEdge({ ...connection, label: res }, eds))
    },
    [setEdges]
  )
  const [target, setTarget] = useState()
  const modify = (target, payload) => {
    const { id } = target
    const isNode = !!nodes.find(e => e.id === id)
    if (isNode) {
      const { name: newName, isAlert } = payload
      if (newName === '' || newName == null) return
      setNodes(
        (nds) => {
          const res = nds.map(e => ({
            ...e,
            data: {
              ...e.data,
              label: e.id === id ? newName : e.data.label,
              isAlert
            }
          }))
          return res
        }
      )
      setTarget(() => null)
    }
  }
  const remove = (target) => {
    const { id } = target
    const isNode = !!nodes.find(e => e.id === id)
    if (isNode) {
      setNodes((nds) => nds.filter(e => e.id !== id))
    }
    setTarget(() => null)
  }
  // change tabIndex
  useEffect(() => {
    setNodes(() => flowData[tabIndex].nodes)
    setEdges(() => flowData[tabIndex].edges)
  }, [tabIndex])

  // save flowData
  useEffect(() => {
    setFlowData((data) => data.map((e, i) => {
      if (i === tabIndex) {
        return { ...e, nodes, edges }
      }
      else {
        return { ...e }
      }
    }))
  }, [nodes, edges])
  return (
    <Stack
      direction="row"
      style={{ width: '100%', height: '100%' }}
    >
      <ReactFlowProvider>
        <Flow
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          clickTarget={
            (node) => setTarget(() => node)
          }
          nodeType={nodeType}
          nodeDialogOpen={nodeDialogOpen}
          setNodeDialogOpen={setNodeDialogOpen}
          gridOpen={gridOpen}
          setGridOpen={setGridOpen}
        />
      </ReactFlowProvider>
      <ModifySideBar
        target={target}
        modify={modify}
        remove={remove}
        setTarget={setTarget}
      />
    </Stack>
  )
}

function Flow ({
  nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, clickTarget, nodeType, nodeDialogOpen, setNodeDialogOpen, gridOpen, setGridOpen
}) {
  // const [isEdge, setIsEdge] = useState(false)
  // const reactFlow = useReactFlow();

  const createNode = useCallback(({ category, name, target, isAlert }) => {
    const { categoryId, categoryName, categoryNameEN } = category
    const maxX = Math.max(...nodes.map(e => e.position.x), 0)
    const maxY = Math.max(...nodes.map(e => e.position.y), 0)
    const addX = 240
    const newNode = {
      id: uid(),
      position: {
        x: maxX + addX,
        y: maxY,
      },
      data: {
        label: name,
        categoryId,
        categoryName,
        categoryNameEN,
        isAlert,
        ...target
      },
      type: 'card'
    }
    setNodes((nds) => nds.concat(newNode))
  }, [nodes])
  const createEdge = useCallback((sourceId, targetId, name) => {
    const newEdge = {
      id: uid(), source: sourceId, target: targetId, label: name || ''
    }
    setEdges((egs) => egs.concat(newEdge))
  }, [])

  const onNodeClick = (evt, node) => {
    console.log(node)
    clickTarget(node)
  }
  const onEdgeClick = (evt, edge) => {
    console.log(edge)
  }
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      defaultEdgeOptions={edgeOptions}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      className="transition"
      connectionLineStyle={connectionLineStyle}
    >
      <Controls style={{ fill: "#fff", color: '#fff' }}>
        <ControlButton
          sx={{ fill: "#fff", color: '#fff', '&:hover': { fill: '#000', color: '#000' } }}
          onClick={() => setGridOpen((value => !value))}>
          <GridOnIcon />
        </ControlButton>
      </Controls>
      {/* <MiniMap zoomable pannable /> */}
      {gridOpen ? <Background className="bg-gray-800" /> : null}
      <NodeDialog
        open={nodeDialogOpen}
        setOpen={setNodeDialogOpen}
        category={nodeType}
        createNode={createNode}
      />
    </ReactFlow>
  )
}
