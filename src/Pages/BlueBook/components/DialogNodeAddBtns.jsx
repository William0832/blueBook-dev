import { Card, CardContent, CardMedia, Unstable_Grid2 as Grid } from "@mui/material"
import { useMemo } from "react"

function NodeItemSelect ({ data, target, setTarget }) {
  const isSelected = useMemo(() => data.objectId === target?.objectId, [target])
  return (
    <>
      {data &&
        <Card
          onClick={() => setTarget(data)}
          sx={{
            p: 1,
            bgcolor: isSelected ? 'rgba(0,0,0,.8)' : 'rgba(0,0,0,.6)',
            width: 140, cursor: 'pointer',
            borderRadius: '10px',
            boxShadow: isSelected && '0px 0px 0px 4px #42A5F5'
          }}>
          <CardMedia sx={{ p: .5 }} className="h-[80px]">
            <img src={`/imgs/${data?.objectImage}`} loading="lazy" className="object-scale-down w-full h-full" />
          </CardMedia>
          <CardContent sx={{ color: '#fff', p: 2 }}>
            <p className="text-center">{data?.objectName}</p>
          </CardContent>
        </Card>}
    </>
  )
}

export default function DialogNodeAddBtns ({ list, target, setTarget }) {
  return (
    <Grid container spacing={2}>
      {list.map((e, i) => (
        <Grid
          xs={4}
          key={i}
          sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
          <NodeItemSelect
            data={e}
            target={target}
            setTarget={setTarget} />
        </Grid>
      ))
      }
    </Grid>
  )
}