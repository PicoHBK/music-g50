import PlayerSong from "./components/PlayerSong"
import Albums from "./sections/Albums"
import Artists from "./sections/Artists"
import Songs from "./sections/Songs"

function App() {

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-mylight-50 font-lato ">
      <div className="flex w-full h-full justify-center items-start gap-4">
        <Songs />
          <div className="flex flex-col gap-20">
          <Albums />
          <Artists />
          
          </div>
      </div>
      <PlayerSong />
    </div>
  )
}

export default App
