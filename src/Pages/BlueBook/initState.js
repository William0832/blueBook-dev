import { MarkerType } from 'reactflow'
import CardNode from './components/CardNode/index'

const nodeTypes = { 'card': CardNode }

const edgeTypes = [
  { id: 'electric', label: '電力', color: 'gold' },
  { id: 'water', label: '水', color: 'lightskyblue' },
  { id: 'chemical1', label: '化學原料1', color: 'cyan' },
  { id: 'chemical2', label: '化學原料2', color: 'darkcyan' },
  { id: 'gas', label: '氣體原物料', color: 'lightseagreen' },
  { id: 'wast', label: '廢棄物排放', color: 'darkgoldenrod' },
  { id: 'wastWater', label: '廢水資排放', color: 'lightslategray' },
  // { id: 'lowLight', label: '警示', color: 'red' }
]

const edgeOptions = {
  type: 'step',
  style: {
    strokeWidth: '2',
    // stroke: '#ccc',
  },
  markerEnd: {
    type: MarkerType.Arrow,
    width: 20,
    height: 20,
    // color: '#ccc'
  }
}

const connectionLineStyle = { stroke: '#646cff' }

export {
  nodeTypes,
  edgeTypes,
  edgeOptions,
  connectionLineStyle
}
