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
    <Box sx={{
      borderBottom: 1, borderColor: 'divider', display: 'flex',
      width: 'calc(100vw - 240px)'
    }}>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map(tab => (
          <Tab
            sx={{
              fontSize: '.6rem',
              paddingInline: 1
            }}
            label={tab.tabTitle}
            key={tab.tabId} />
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