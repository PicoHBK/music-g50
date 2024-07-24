import { ArtistType } from "../types/harmony"

function CardArtist({artist}:{artist:ArtistType}) {
  return (
    <div className="flex flex-col max-w-28 justify-center items-center text-center">
        <div className="w-24 h-24 hover:scale-105 hover:text-myprim-400 transition">
          <img src="https://www.lanacion.com.ar/resizer/v2/la-banda-toto-en-1982-steve-porcaro-david-hungate-FJ2XVG4LU5AABHJFZGCUW6LZ3M.JPG?auth=c2dc74924f8a830eb03ff384178a884524a28e4d48fafe6657a935b35b23c589&width=880&height=586&quality=70&smart=true" alt="album" className="object-cover w-full h-full rounded-full" />
        </div>
        <h6 className="font-bold text-mysec-400">{artist.name}</h6>
        <p className="font-normal text-sm text-mysec-800">Artista</p>
    </div>
  )
}

export default CardArtist