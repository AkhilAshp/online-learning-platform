// workspace/page.jsx → <div>Workspace</div>
//    gets wrapped by
// workspace/layout.jsx → <WorkspaceProvider>{children}</WorkspaceProvider>
//    where children = <div>Workspace</div>
//    and provider now correctly returns <div>{children}</div>


import React from 'react'
import WorkspaceProvider from './provider'

function WorkSpaceLayout({children}) {
  return (
    <WorkspaceProvider>
        {children}
    </WorkspaceProvider>
  )
}

export default WorkSpaceLayout