import PlayerSong from "./components/PlayerSong"
import Songs from "./sections/Songs"

function App() {

  return (
    <div className="flex flex-col justify-start items-center min-h-screen w-full bg-mylight-50 font-lato  ">
      <Songs />
      <PlayerSong />
    </div>
  )
}

export default App
