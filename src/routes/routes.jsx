import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Root from '../Pages/Root'
import Flow from '../Pages/BlueBook/BlueBook'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'blueBook/',
        element: <Flow />
      }
    ]
  },
])

export default function Routes () {
  return (<RouterProvider router={router} />)
}