import { MarkerType } from 'reactflow'
import CardNode from './components/CardNode/index'
import objectList from '../../assets/objectList.json'

const { categories } = objectList.data
console.table(categories)
console.table(categories[0].objectList)
console.table(categories[1].objectList)
console.table(categories[2].objectList)
export { categories }

export const nodeTypes = { 'card': CardNode }

export const defaultFlowData = [{
  id: 1,
  tabLabel: 'tab1',
  nodes: [],
  edges: []
}]

export const edgeOptions = {
  type: 'step',
  style: {
    strokeWidth: '2',
    stroke: '#ccc',
  },
  markerEnd: {
    type: MarkerType.Arrow,
    width: 20,
    height: 20,
    color: '#ccc'
  }
}

export const connectionLineStyle = { stroke: '#646cff' }


