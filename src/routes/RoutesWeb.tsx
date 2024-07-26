import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Header from "../components/Header";
import LateralBar from "../components/LateralBar";

const Layout = () => (
    <>
      <section className="flex w-full">
        <LateralBar />
        <div className="flex flex-col w-full">
          <Header />
          <Outlet />
        </div>
      </section>
    </>
  );
const routers = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path:"/",
          element:<Home />,
          errorElement: <h1>Error del Home</h1>
        },
        {
            path:"/login",
            element:<Login />,
            errorElement: <h1>Error del Login</h1>
          },
      ]
    }
  ])

function RoutesWeb() {
    return (
      <RouterProvider router={routers} />
    )
  }
  
  export default RoutesWeb