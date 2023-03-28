import {
  // createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom"
import Root from '../pages/Root'
import Flow from '../pages/BlueBook/BlueBook'

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'blueBook/:pId/:bpId',
        element: <Flow />
      }
    ]
  },
])

export default function Routes () {
  return (<RouterProvider router={router} />)
}