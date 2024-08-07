import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Header from "../components/Header";
import LateralBar from "../components/LateralBar";
import SongsRoute from "../pages/SongsRoute";
import AlbumsRoute from "../pages/AlbumsRoute";
import ArtistsRoute from "../pages/ArtistsRoute";
import PlayListsRoute from "../pages/PlayListsRoute";
import GenRes from "../pages/GenRes";

const Layout = () => (
    <>
      <section className="flex w-full relative">
        <LateralBar />
        <div className="flex flex-col w-full m-5">
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
        {
            path:"/songs",
            element:<SongsRoute/>,
            errorElement: <h1>Error Songs</h1>
          },
        {
            path:"/albums",
            element:<AlbumsRoute/>,
            errorElement: <h1>Error Albums</h1>
          },
        {
            path:"/artists",
            element:<ArtistsRoute/>,
            errorElement: <h1>Artists Error</h1>
          },
        {
            path:"/playlists",
            element:<PlayListsRoute/>,
            errorElement: <h1>PlayLists Error</h1>
          },
        {
            path:"/genres",
            element:<GenRes />,
            errorElement: <h1>PlayLists Error</h1>
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