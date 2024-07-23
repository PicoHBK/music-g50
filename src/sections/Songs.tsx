import { useQuery } from "@tanstack/react-query";
import apiHarmSongPublic from "../apis/publicHarmonySong";
import { SongsType } from "../types/harmony";
import { useSongsContext } from "../hooks/usePlayerSong";

const fetchSongs = async () => {
  const { data } = await apiHarmSongPublic.get<SongsType[]>(`/songs`);
  return data;
};

function useSongs() {
  const { data } = useQuery({
    queryKey: ["songs"],
    queryFn: fetchSongs,
    staleTime: Infinity,
  });

  return { data };
}
function Songs() {
  const { data } = useSongs();
  const {dispatch} = useSongsContext()
  const addToPlayer = (song: SongsType) => {
    dispatch({type: 'SET_SONG', payload: song})
  }
  return (
    <div className="w-full max-w-96">
      <h2 className="text-lg font-bold text-myprim-600">Canciones</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-myprim-100 text-myprim-900">
              <th className="px-4 py-2 text-center font-normal">#</th>
              <th className="px-4 py-2 text-center font-normal">Nombre</th>
              <th className="px-4 py-2 text-center font-normal">Duración</th>
              <th className="px-4 py-2 text-center font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((song, index) => (
              <tr
                key={song.id}
                className="hover:bg-myprim-400 transition-colors"
                onClick={()=>addToPlayer(song)}
              >
                <td className="px-4 py-2 text-center text-mydark-50 font-light select-none">
                  {index + 1}
                </td>
                <td className="px-4 py-2 text-center text-mydark-500 font-bold select-none">
                  {song.title}
                </td>
                <td className="px-4 py-2 text-center text-mydark-50 font-normal select-none">
                  {"1:23"}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="max-w-8 hover:cursor-pointer hover:scale-105 transition opacity-85">
                    <img
                      src="https://img.icons8.com/?size=100&id=21622&format=png&color=01272B"
                      alt="menu"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Songs;
