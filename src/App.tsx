import PlayerSong from "./components/PlayerSong"
import RoutesWeb from "./routes/RoutesWeb"

function App() {

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-mylight-50 font-lato">
      <RoutesWeb/>
      <div className="fixed bottom-0 w-full">
        <PlayerSong />
      </div>
    </div>
  )
}

export default App
