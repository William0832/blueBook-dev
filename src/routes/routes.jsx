import {
  // createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom"
import Root from '../pages/root.jsx'
import BlueBook from '../pages/blueBook/blueBook.jsx'

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'blueBook/:pId/:bpId',
        element: <BlueBook />
      }
    ]
  },
])

export default function Routes () {
  return (<RouterProvider router={router} />)
}