import Albums from "../sections/Albums"
import Artists from "../sections/Artists"
import Songs from "../sections/Songs"

function Home() {
  return (
    <div className="flex w-full h-full justify-center items-start gap-4">
        <Songs />
          <div className="flex flex-col gap-20">
          <Albums />
          <Artists />
          
          </div>
      </div>
  )
}

export default Home