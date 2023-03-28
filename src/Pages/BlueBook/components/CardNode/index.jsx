import { useMemo } from 'react'
import { Handle, Position } from 'reactflow'
import {
  Badge, Card, CardMedia, CardContent, Typography,
} from '@mui/material'
import './style.css'
import { v4 as uuid } from 'uuid'

const nodeWidth = 150
const nodeHeight = nodeWidth * 1.2
const nodeImgHeight = nodeHeight * 0.6
const leftNodeLength = 25
const rightNodeLength = nodeWidth - leftNodeLength
const defaultHandles = [
  { id: '1', position: Position.Top, style: { left: leftNodeLength } },
  { id: '2', position: Position.Top },
  { id: '3', position: Position.Left },
  { id: '4', position: Position.Right },
  { id: '5', position: Position.Bottom, style: { left: leftNodeLength } },
  { id: '6', position: Position.Bottom },
  { id: '7', position: Position.Bottom, style: { left: rightNodeLength } }
]

function CardNode ({ data, isConnectable }) {
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

