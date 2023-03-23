import { color } from "@mui/system"

export const getNodeStyle = (todoType) => {
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

export const getEdgeStyle = (edgeType) => {
  // '電力 淺黃色(gold)
  switch (edgeType) {
    case 'electric':
      return { color: 'gold' }
  }
  // 水 淺藍色(lightskyblue)
  //   化學原物料1 - 青色 cyan
  //   化學原物料2 – 綠色 darkcyan
  //   氣體原物料 - lightseagreen
  // 廢棄物排放 咖啡色 darkgoldenrod
  // 廢水資排放 灰色 lightslategray
  // Low light樣式都預設為 red'
}