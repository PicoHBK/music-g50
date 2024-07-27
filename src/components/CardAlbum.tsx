import { AlbumType } from "../types/harmony"

function AlbumCard({album}: {album:AlbumType}) {
  return (
    <div className="flex flex-col max-w-28 justify-center items-center text-center">
        <div className="w-24 h-32 hover:scale-105 hover:text-myprim-400 transition">
          {album.cover ? <img src={album.cover} alt="album" className="object-cover w-full h-full rounded-lg" />:<img src="https://e1.pxfuel.com/desktop-wallpaper/1002/353/desktop-wallpaper-minimalist-dsotm-pinkfloyd-pink-floyd-2018.jpg" alt="album" className="object-cover w-full h-full rounded-lg" />}
        </div>
        <h6 className="font-bold text-mydark-700">{album.title}</h6>
        {album.year && <p className="font-normal text-sm text-mydark-700">{album.year}</p>}
    </div>
  )
}

export default AlbumCard