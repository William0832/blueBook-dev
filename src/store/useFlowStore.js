import { create } from 'zustand'
import { devtools } from "zustand/middleware"
import { v4 as uid } from 'uuid'
import { getEdgeStyle, getRandomItem } from '../utils'
import { edgeOptions } from '../pages/BlueBook/initState'
import {
  isNode,
  // addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { parseFlowContent } from '../utils';
import { getCategories, getProjectList, getBlueprints, addBlueprint, updateBlueprint } from '../API/blueBookApi'


const getHandles = (node) => {
  const symbolProp = Object.getOwnPropertySymbols(node)[0]
  return node[symbolProp].handleBounds?.source
}
const getNodeHandles = ({ rf, source, target, sourceHandle, targetHandle }) => {
  if (sourceHandle && targetHandle) return { sourceHandle, targetHandle }
  const targetHandles = getHandles(rf.getNode(target))
  const sourceHandles = getHandles(rf.getNode(source))
  return {
    sourceHandle: getRandomItem(targetHandles)?.id,
    targetHandle: getRandomItem(sourceHandles)?.id
  }
}
const setEdgeAlert = (edge, isAlert = true) => {
  const style = getEdgeStyle(edge.data.edgeType)
  return {
    ...edge,
    data: {
      ...edge.data, isAlert
    },
    style: {
      ...edge.style,
      stroke: isAlert ? 'red' : style['stroke']
    },
    markerEnd: {
      ...edge.markerEnd,
      color: isAlert ? 'red' : style['stroke']
    }
  }
}

const setLevelDownEdgesAlert = (nodeId, edges, isAlert = true) => {
  return edges
    .filter(edg => edg.source === nodeId)
    .map(edge => setEdgeAlert(edge, isAlert))
}
const useFlowStore = create(
  devtools((set, get) => {
    const requestHandler = async (key, apiCallback, payload) => {
      try {
        set(() => ({ loading: true }))
        const data = await apiCallback(payload)
        set(() => ({ loading: false, ...data }))
      } catch (err) {
        console.warn(err)
        set(() => ({
          loading: false, err
        }))
      }
    }
    return {
      isInteracted: false,
      loading: false,
      err: null,
      blueprintName: 'blueBook',
      // setBlueprintName: (name) => {
      //   console.log(name)
      //   set(() => ({ blueprintName: name }))
      // },
      categories: [],
      projects: [], // { blueprints: [{}], id, name}
      tabs: [],
      nodes: [],
      edges: [],
      target: null,
      preConnect: null,
      setPreConnect: (con) => set(() => ({ preConnect: con })),
      pId: '',
      bpId: '',
      tabId: '',
      tabIndex: 0,
      setTarget: (el) => set(() => ({ target: el })),
      setTabIndex: (index) => {
        const { tabs } = get()
        const { tabContent, tabId } = tabs[index]
        const data = parseFlowContent(tabContent)
        set(() => ({ tabIndex: index, ...data, tabId }))
      },
      setTabIndex: (index) => set(() => ({ tabIndex: index })),
      setTabId: (id) => {
        if (!id) return
        set(() => ({ tabId: id }))
      },
      // flow-functions
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      // apis
      fetchCategories: async () => {
        await requestHandler('', getCategories)
      },
      fetchProjects: async () => {
        await requestHandler('', getProjectList)
      },
      fetchBlueprint: async ({ pId, bpId }) => {
        try {
          if (!pId || !bpId) return
          const { tabIndex } = get()
          set(() => ({ loading: true, pId, bpId }))
          const data = await getBlueprints({ pId, bpId })
          const { bpName: blueprintName } = data.blueprint
          const tabs = data.blueprint.tabs
            .sort((a, b) => a.tabId - b.tabId)
          const { tabId, tabContent } = tabs[tabIndex]
          const { nodes, edges } = parseFlowContent(tabContent)
          set(() => ({ loading: false, tabs, tabId, nodes, edges, blueprintName }))
        } catch (err) {
          set(() => ({ loading: false, err }))
          console.warn(err)
        }
      },
      createBlueprint: async () => {
        try {
          set(() => ({ loading: true }))
          const { pId, bpId } = get()
          const data = await addBlueprint({ pId, bpId })
          const { tab } = data
          set((state) => ({
            loading: false,
            tabs: state.tabs.concat({
              ...tab,
              tabId: tab.tabId[0]
            })

          }))
        } catch (err) {
          set(() => ({ loading: false, err }))
          console.warn(err)
        }
      },
      save: async ({ title, content }) => {
        try {
          set(() => ({ loading: true }))
          const { pId, bpId, tabId, tabIndex, nodes, edges, tabs } = get()
          const tab = tabs[tabIndex]
          title = title || tab?.tabTitle
          content = content || { nodes, edges }
          const data = await updateBlueprint({ pId, bpId, tabId, title, content })
          // console.log(data)
          set((state) => ({
            loading: false,
            tabs: tabs.map(tab => ({
              ...tab,
              tabTitle: tab.tabId === tabId
                ? title : tab.tabTitle,
              tabContent: tab.tabId === tabId
                ? JSON.stringify(content) : tab.tabContent
            }))
          }))
        } catch (err) {
          console.warn(err)
          set(() => ({ loading: false, err }))
        }
      },
      // changeTabName: async ({ name }) => {

      // },
      // CUD nodes-edges
      createNode: async ({ category, name, target, isAlert }) => {
        const { nodes, save } = get()
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
        set(() => ({ nodes: nodes.concat(newNode) }))
        await save({})
      },
      createEdge: async (rf, payload) => {
        const { edges, save } = get()
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
          ...getNodeHandles({ rf, source, target, sourceHandle, targetHandle })
        }
        set(() => ({ preConnect: null, edges: edges.concat(newEdge) }))
        await save({})
      },
      modify: async (element, payload) => {
        const { id } = element
        const isNodeTarget = isNode(element)
        const { save, nodes, edges } = get()
        if (isNodeTarget) {
          const { name, isAlert } = payload
          const newName = name || element?.data?.label
          const modifyEdges = setLevelDownEdgesAlert(id, edges, isAlert)
          set(() => ({
            target: null,
            nodes: nodes.map(e => ({
              ...e,
              data: {
                ...e.data,
                label: e.id === id ? newName : e.data.label,
                isAlert: e.id === id ? isAlert : e.data.isAlert
              }
            })),
            edges: edges.map(edge => {
              const modifyEdge = modifyEdges.find(m => m.id === edge.id)
              return modifyEdge ? modifyEdge : edge
            })
          }))
          await save({})
          return
        }
        let { name, isAlert, edgeType, target, targetHandle, source, sourceId } = payload
        set(() => ({
          target: null,
          edges: edges.map(edg => {
            if (edg.id === id) {
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
          })
        }))
        await save({})
      },
      remove: async (element) => {
        const { target, save, nodes, edges } = get()
        const { id } = target
        const isNodeElement = isNode(element)
        isNodeElement
          ? set(() => ({
            nodes: nodes.filter(e => e.id !== id)
          }))
          : set(() => ({
            edges: edges.filter(e => e.id !== id)
          }))
        await save({})
      }
    }
  }))

export default useFlowStore