const getNodeStyle = (todoType) => {
  const defaultNodeOptions = {
    borderRadius: '10px',
    fontWeight: 700
  }
  switch (todoType) {
    case 'start':
      return ''
    case 'todo':
      return {
        ...defaultNodeOptions,
        border: '2px solid #C1C7D0',
        color: '#4F5E78',
        backgroundColor: '#DFE1E6',
      }
    case 'done':
      return {
        ...defaultNodeOptions,
        border: '2px solid #ABF5D1',
        color: '#066645',
        backgroundColor: '#E3FCEF',
      }
    case 'card':
      return {
      }
    default:
      return {
        ...defaultNodeOptions,
        border: '2px solid #C5DFFF',
        color: '#0747A6',
        backgroundColor: '#DEEBFF',
      }
  }
}

const getEdgeStyle = (edgeType) => {
  // '電力 淺黃色(gold)
  switch (edgeType) {
    case 'electric':
      return { stroke: 'gold' }
    case 'water':
      return { stroke: 'lightskyblue' }
    case 'chemical1':
      return { stroke: 'cyan' }
    case 'chemical2':
      return { stroke: 'darkcyan' }
    case 'gas':
      return { stroke: 'lightseagreen' }
    case 'wast':
      return { stroke: 'darkgoldenrod' }
    case 'wastWater':
      return { stroke: 'lightslategray' }
    case 'lowLight':
      return { stroke: 'red' }
  }
}

const parseFlowContent = (data) => {
  const parsedData = JSON.parse(data)
  const result = { edges: [], nodes: [] }
  if (parsedData == null) return result
  const { edges, nodes } = parsedData
  result.edges = edges ? edges : []
  result.nodes = nodes ? nodes : []
  return result
}

const getRandomItem = (list) => list[Math.floor(Math.random() * list.length)]

const firstToUpper = (string) => string.charAt(0).toUpperCase() + string.slice(1)

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
const getDistance = ([x1, y1], [x2, y2]) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

export {
  getNodeStyle,
  getEdgeStyle,
  parseFlowContent,
  getRandomItem,
  firstToUpper,
  getHandles,
  getNodeHandles,
  getDistance
}