import React from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { Box } from '@mui/material'


const StudentDashboard = () => {
  return (
   <Box display="flex" width="100%">
    <Sidebar/>
    <Box flexGrow={1}>
      <Topbar/>
      Dashboard
    </Box>
   </Box>
  )
}

export default StudentDashboard