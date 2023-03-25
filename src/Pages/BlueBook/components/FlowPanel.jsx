import { v4 as uid } from 'uuid'
import { useState, useCallback, useEffect, useMemo } from 'react'
import GridOnIcon from '@mui/icons-material/GridOn';

import ReactFlow, {
  isNode,
  addEdge, Panel, Background, Controls, MiniMap, ControlButton,
  ReactFlowProvider, useReactFlow,
  ConnectionMode, applyNodeChanges, applyEdgeChanges
} from 'reactflow'

import { Stack } from '@mui/material'
import ModifySideBar from './ModifySideBar'
import DialogNode from './DialogNode'
import DialogEdge from './DialogEdge'


import {
  edgeTypes,
  nodeTypes, edgeOptions, connectionLineStyle
} from '../initState.js'
import { getEdgeStyle } from '../utils'

import 'reactflow/dist/style.css'
import '../style.css'

export default function FlowPanel ({
  tabIndex, flowData, setFlowData, nodeDialogOpen, setNodeDialogOpen, nodeType,
  gridOpen, setGridOpen, isInteracted, edgeDialogOpen, setEdgeDialogOpen
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
      ...e,
    })))
  const [edges, setEdges] = useState(defaultEdges)
  const [preConnect, setPreConnect] = useState(null)
  const [target, setTarget] = useState()

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds))
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds))
  )

  const onConnect = useCallback(
    (connection) => {
      if (isInteracted) return
      if (connection.source === connection.target) {
        alert('請選其他設備的連接點')
        return
      }
      console.log(connection)

      setEdgeDialogOpen(() => true)
      setPreConnect(() => connection)
    },
    [edges]
  )

  const modify = (element, payload) => {
    const { id } = element
    const isNodeTarget = isNode(element)
    if (isNodeTarget) {
      const { name, isAlert } = payload
      const newName = name || element?.data?.label
      setNodes(
        (nds) => {
          const res = nds.map(e => ({
            ...e,
            data: {
              ...e.data,
              label: e.id === id ? newName : e.data.label,
              isAlert: e.id === id ? isAlert : e.data.isAlert
            }
          }))
          return res
        }
      )
      setTarget(() => null)
      return
    }
    let { name, isAlert, edgeType, target, targetHandle, source, sourceId } = payload
    setEdges((edges) => edges.map(edg => {
      if (edg.id === element.id) {
        edgeType = edgeType || edg.data.edgeType
        const style = getEdgeStyle(edgeType)
        return {
          ...edg,
          label: name || '',
          data: { isAlert, edgeType },
          target: target || edg.target,
          targetHandle: targetHandle || edg.targetHandle,
          source: source || edg.source,
          sourceId: sourceId || edg.sourceId,
          style: {
            ...edg.style,
            stroke: isAlert ? 'red' : style['stroke']
          },
          markerEnd: {
            ...edg.markerEnd,
            color: isAlert ? 'red' : style['stroke']
          }
        }
      }
      return edg
    }))

    console.log(element, payload)
    setTarget(() => null)

  }
  const remove = (element) => {
    const { id } = target
    const isNodeElement = isNode(element)
    isNodeElement
      ? setNodes((nds) => nds.filter(e => e.id !== id))
      : setEdges((edges) => edges.filter(e => e.id !== id))
    setTarget(() => null)
  }
  const alertDownStreamNodes = (target, isAlert = true) => {
    const getDownStreamNodes = (edges, targetId, visitedEdgeIds = []) => {
      const downStreamNodes = []
      edges = edges.filter(edge => !visitedEdgeIds.includes(edge.id))
      edges.forEach(edge => {
        if (edge.source === targetId) {
          downStreamNodes.push(edge.target)
          visitedEdgeIds.push(edge.id)
          downStreamNodes.push(
            ...getDownStreamNodes(edges, edge.target, visitedEdgeIds)
          )
        }
      })
      return downStreamNodes
    }
    const downStreamNodeIds = [
      target.id, ...getDownStreamNodes(edges, target.id)
    ]

    downStreamNodeIds.forEach(id => {
      const target = nodes.find(node => node.id === id)
      modify(target, { isAlert })
    })
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
          clickTarget={(node) => setTarget(() => node)}
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
        target={target}
        modify={modify}
        remove={remove}
        setTarget={setTarget}
        isInteracted={isInteracted}
        alertDownStreamNodes={alertDownStreamNodes}
      />
    </Stack>
  )
}

function Flow ({
  nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, clickTarget, nodeType, nodeDialogOpen, setNodeDialogOpen, gridOpen, setGridOpen,
  edgeDialogOpen, setEdgeDialogOpen,
  preConnect,
  setPreConnect
}) {
  const rf = useReactFlow()
  const getHandles = (node) => {
    const symbolProp = Object.getOwnPropertySymbols(node)[0]
    return node[symbolProp].handleBounds?.source
  }
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

  const getRandomItem = (list) => list[Math.floor(Math.random() * list.length)]
  const getNodeHandles = ({ source, target, sourceHandle, targetHandle }) => {
    if (sourceHandle && targetHandle) return { sourceHandle, targetHandle }
    const targetHandles = getHandles(rf.getNode(target))
    const sourceHandles = getHandles(rf.getNode(source))
    return {
      sourceHandle: getRandomItem(targetHandles)?.id,
      targetHandle: getRandomItem(sourceHandles)?.id
    }
  }

  const createEdge = useCallback((payload) => {
    const { label, source, target, sourceHandle, targetHandle, edgeType } = payload
    const newEdge = {
      ...edgeOptions,
      id: uid(),
      style: {
        ...edgeOptions.style,
        ...getEdgeStyle(payload.edgeType)
      },
      markerEnd: {
        ...edgeOptions.markerEnd,
        color: getEdgeStyle(payload.edgeType)['stroke']
      },
      data: { edgeType, isAlert: false },
      label,
      source, target,
      ...getNodeHandles({ source, target, sourceHandle, targetHandle })
    }
    setEdges((egs) => egs.concat(newEdge))
    setPreConnect(() => null)
  }, [edges])

  const onNodeClick = (evt, node) => {
    console.log(node)
    clickTarget(node)
  }
  const onEdgeClick = (evt, edge) => {
    console.log(edge)
    clickTarget(edge)
  }
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      connectionMode={ConnectionMode.Loose}
      className="transition"
      nodeTypes={nodeTypes}
      defaultEdgeOptions={edgeOptions}
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
      />
    </ReactFlow>
  )
}
