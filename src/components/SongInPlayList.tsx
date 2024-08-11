import apiHarmSongPrivate from "@/apis/privateHarmonySong";
import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { usePlaylistEntry } from "@/hooks/usePlayListEntrys";
import { PlayListEntry, PlayListType } from "@/types/harmony";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface FormData {
  order: number;
  playlist: number;
  song: number;
}

const postPlayListEntry = ({ formData }: { formData: FormData }) => {
  const token = localStorage.getItem("token");
  return apiHarmSongPrivate
    .post<PlayListEntry>("/harmonyhub/playlist-entries/", formData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const deletePlayListEntry = async (id: number) => {
  const token = localStorage.getItem("token");
  const { data } = await apiHarmSongPublic.delete(`playlist-entries/${id}/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return data;
};

function SongInPlayList({
  playlist,
  idSong,
}: {
  playlist: PlayListType;
  idSong: number;
}) {
  const queryClient = useQueryClient();
  const { data: playListEntries } = usePlaylistEntry();
  const { mutate } = useMutation({
    mutationFn: postPlayListEntry,
    onSuccess: (data) => {
      console.log("Canción añadida a la playlist");
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["playlists-infiity", "playlist-entries", "songs", "playlistsById","playlists"],
      });
      // Realiza alguna acción cuando la canción se añada a la playlist
    },
    onError: (error) => {
      console.error("Error añadiendo canción a la playlist:", error);
      // Realiza alguna acción en caso de error al añadir la canción a la playlist
    },
  });
  const { mutate: deletePlayListEntryMutate } = useMutation({
    mutationFn: deletePlayListEntry,
    onSuccess: (data) => {
      console.log("Canción quitada de la playlist");
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["playlists", "playlist-entries", "songs", "playlistsById","playlists-infiity"] });
      // Realiza alguna acción cuando la canción se añada a la playlist
    },
    onError: (error) => {
      console.error("Error añadiendo canción a la playlist:", error);
      // Realiza alguna acción en caso de error al añadir la canción a la playlist
    },
  });

  const [check, setCheck] = useState(false);

  useEffect(() => {
    const isInPlaylist = playlist.entries.includes(idSong);
    setCheck(isInPlaylist);

    if (isInPlaylist) {
      console.log("La canción estaba inicialmente en la playlist.");
      // Realiza alguna acción si la canción estaba inicialmente en la playlist
    } else {
      console.log("La canción no estaba inicialmente en la playlist.");
    }
  }, [playlist, idSong]);

  const handleCheckboxChange = () => {
    const isInPlaylist = playlist.entries.includes(idSong);
    console.log(playlist)
    console.log(idSong)
    console.log(isInPlaylist)
    setCheck((prevCheck) => !prevCheck);

    if (!isInPlaylist) {
      const formData: FormData = {
        order: playlist.entries.length + 1, // ejemplo de cómo podrías establecer el orden
        playlist: playlist.id,
        song: idSong,
      };
      mutate({ formData });
    } else {
      const idPlayListEntry = playListEntries?.find(
        (plen) => plen.song === idSong && plen.playlist === playlist.id
      );
      if (idPlayListEntry) deletePlayListEntryMutate(idPlayListEntry.id);
    }
  };

  return (
    <div
      key={playlist.id}
      className="flex w-full gap-3 justify-center items-center"
    >
      <div className="h-8 w-8">
        <img
          src="https://img.icons8.com/?size=100&id=0noXTg95F2Al&format=png&color=000000"
          alt="play list"
          className="w-full h-full object-fill"
        />
      </div>
      <span className="text-md font-semibold text-myprim-800">
        {playlist.name}
      </span>
      <input checked={check} type="checkbox" onChange={handleCheckboxChange} />
    </div>
  );
}

export default SongInPlayList;
