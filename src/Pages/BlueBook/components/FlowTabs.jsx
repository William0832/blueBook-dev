import { Tabs, Tab, Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

export default function FlowTabs ({ tabs, tabIndex, setTabIndex, addNewTab, isInteracted }) {

  const handleChange = (event, newValue) => {
    console.log(newValue)
    setTabIndex(() => newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map(tab => (
            <Tab label={tab.label} key={tab.id} />
          ))}
        </Tabs>
        <Button
          disabled={isInteracted}
          sx={{ maxWidth: '20px' }}
          onClick={addNewTab}>
          <AddIcon />
        </Button>
      </Box>
    </Box>
  );
}