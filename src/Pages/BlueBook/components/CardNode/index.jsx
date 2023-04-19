import { useCallback, useMemo } from 'react'
import { Handle, Position } from 'reactflow'
import {
  Badge, Card, CardMedia, CardContent, Typography,
} from '@mui/material'
import './style.css'
import useFlowStore from '../../../../store/useFlowStore'
import { shallow } from 'zustand/shallow'

const nodeWidth = 150
const nodeHeight = nodeWidth * 1.2
const nodeImgHeight = nodeHeight * 0.6
const leftNodeLength = 25
const rightNodeLength = nodeWidth - leftNodeLength
const insertLength = 0
const defaultHandles = [
  {
    id: '1', position: Position.Top,
    style: { left: leftNodeLength, top: insertLength }
  },
  {
    id: '2', position: Position.Top,
    style: { top: insertLength }
  },
  {
    id: '3', position: Position.Top,
    style: { left: rightNodeLength, top: insertLength }
  },
  {
    id: '4', position: Position.Left,
    style: { left: insertLength }
  },
  {
    id: '5', position: Position.Right,
    style: { right: insertLength }
  },
  {
    id: '6', position: Position.Bottom,
    style: { left: leftNodeLength, bottom: insertLength }
  },
  {
    id: '7', position: Position.Bottom,
    style: { bottom: insertLength }
  },
  {
    id: '8', position: Position.Bottom,
    style: { left: rightNodeLength, bottom: insertLength }
  }
]

function CardNode ({ data, isConnectable }) {
  const { isConnectedStart, aroundNodeId, aroundHandelId } = useFlowStore((state) => ({
    isConnectedStart: state.isConnectedStart,
    //   aroundHandelId: state.aroundHandelId,
    //   aroundNodeId: state.aroundNodeId
  }), shallow)
  // const isAroundHandel = useCallback(
  //   (handelId) => data.id === aroundNodeId && handelId === aroundHandelId, [aroundHandelId]
  // )
  const imgSrc = useMemo(() => {
    const src = data.isAlert ? data.objectImageAlarm : data.objectImage
    return `./imgs/${src}`
  }, [data])
  const MyCard = () => (
    <>
      <Card
        sx={{ width: `${nodeWidth}px`, height: `${nodeHeight}px`, pointerEvents: 'none' }}>
        <CardMedia
          sx={{ height: `${nodeImgHeight}px`, padding: '.5rem', paddingBottom: 0 }}>
          <img
            className="w-full h-full object-contain"
            src={imgSrc || ''}
            alt={data?.objectName || 'no-img'} />
        </CardMedia>
        <CardContent sx={{ paddingTop: 1 }}>
          <Typography
            variant="h5"
            component="div"
            align='center'
            sx={{ width: '100%', overflowWrap: 'break-word' }}>
            {data.label}
          </Typography>
        </CardContent>
      </Card>
      {
        defaultHandles.map(e => (
          <Handle
            id={e.id}
            key={e.id}
            type="source"
            position={e.position}
            isConnectable={isConnectable}
            style={e.style}
            className={`${isConnectedStart ? 'connected' : ''}`}
          />
        ))
      }
    </>
  )
  return (
    <>
      {data?.isAlert ?
        <Badge color="error" badgeContent="!">
          <MyCard />
        </Badge> :
        <MyCard />
      }
    </>

  )
}

export default CardNode

