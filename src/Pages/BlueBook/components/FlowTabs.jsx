import { Tabs, Tab, Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import useFlowStore from '../../../store/useFlowStore'
import { shallow } from 'zustand/shallow'
export default function FlowTabs ({ addNewTab, isInteracted }) {


  const { tabIndex, tabs, setTabIndex } = useFlowStore((state) => ({
    tabIndex: state.tabIndex,
    tabs: state.tabs,
    setTabIndex: state.setTabIndex
  }), shallow)

  const handleChange = (event, newValue) => {
    setTabIndex(newValue)
  }
  return (
    <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ width: '100%' }}
      >
        {tabs.map(tab => (
          <Tab label={tab.tabTitle} key={tab.tabId} />
        ))}
      </Tabs>
      <Button
        disabled={isInteracted}
        sx={{ maxWidth: '20px' }}
        onClick={addNewTab}>
        <AddIcon />
      </Button>
    </Box>
  )
}