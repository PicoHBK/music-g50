import { useState, useRef, ChangeEvent, useEffect } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { useArtists } from "@/hooks/useArtists";
import { usePlaylistContext } from "@/hooks/usePlayListContext";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { SongsType } from "@/types/harmony";
import apiHarmSongPublic from "@/apis/publicHarmonySong";

const fetchSong = async (ctx: QueryFunctionContext): Promise<SongsType> => {
  const [_, id] = ctx.queryKey;
  void _;
  const { data } = await apiHarmSongPublic.get<SongsType>(`songs/${id}`);
  return data;
};

const PlayerSong = () => {
  const { state, dispatch } = usePlaylistContext();
  const [playing, setPlaying] = useState(true);
  const [mute, setMute] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(0.1);

  const { data } = useQuery({
    queryKey: ["fetch-song-player", state.currentSong],
    queryFn: fetchSong,
    staleTime: Infinity,
    enabled: state.currentSong !== null, // Solo habilita la consulta si `currentSong` no es null
  });

  useEffect(() => {
    console.log(state);
  }, [state]);

  const handlePlay = () => {
    setPlaying(!playing);
  };

  const handleRepeat = () => {
    setRepeat(!repeat);
  };
  const handleShuffle = () => {
    setShuffle(!shuffle);
    if (!shuffle) {
      dispatch({ type: 'SHUFFLE_PLAYLIST', payload: undefined });
    } else {
      dispatch({ type: 'UNSHUFFLE_PLAYLIST', payload: undefined });
    }
  };
  
  const handleNext = () => {
    if (state.nextSong) {
      dispatch({ type: "NEXT_SONG", payload: undefined });
    }
    return;
  };
  const handlePrev = () => {
    if (state.prevSong) {
      dispatch({ type: "PREV_SONG", payload: undefined });
    }
    return;
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume !== 0) {
      setMute(false);
    } else {
      setMute(true);
    }
  };

  const playerRef = useRef<ReactPlayer | null>(null);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const { data: artists } = useArtists();

  const handleProgress: ReactPlayerProps["onProgress"] = (state) => {
    setPlayed(state.played);
  };

  const handleDuration: ReactPlayerProps["onDuration"] = (duration) => {
    setDuration(duration);
  };

  const handleSeekChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    if (playerRef.current) {
      playerRef.current.seekTo(newPlayed);
    }
  };

  const handleMute = () => {
    setMute(!mute);
  };

  const endSong = () => {
    console.log("Fin de la canción");
    if (state.nextSong && !repeat) {
      dispatch({ type: "NEXT_SONG", payload: undefined });
    }
    if (!state.nextSong && !repeat) {
      setPlaying(false);
    }
  };

  return (
    <div className="flex flex-col bottom-0 left-0 w-full bg-myprim-50 p-4 min-h-24 justify-around lg:flex-row mt-auto">
      <section className="flex w-full justify-center items-center gap-2">
        <button onClick={handlePlay} className="w-12 h-12">
          <img
            src="https://img.icons8.com/?size=100&id=0is6nw0hGPP7&format=png&color=000000"
            alt="album"
            className="object-fill w-full h-full"
          />
        </button>
        <div className="flex flex-col">
          <p className="text-sm font-bold">{data?.title}</p>
          {artists?.map(
            (artist) =>
              data?.artists.includes(artist.id) && (
                <p key={artist.id} className="text-sm font-normal">
                  {artist.name}
                </p>
              )
          )}
        </div>
        <ReactPlayer
          ref={playerRef}
          className="react-player"
          url={data?.song_file}
          width="0%"
          height="0%"
          playing={playing}
          onEnded={endSong}
          muted={mute}
          onProgress={handleProgress}
          onDuration={handleDuration}
          volume={volume}
          loop={repeat}
        />
      </section>

      <div>
        <section className="flex lg:min-w-[600px] justify-center items-center gap-4">
          <button
            onClick={handleShuffle}
            className="w-6 h-6 hover:scale-105 transitions"
          >
            <img
              src={
                "https://img.icons8.com/?size=100&id=Rbxyhe2VwSBi&format=png&color=" +
                (shuffle ? "027682" : "000000")
              }
              alt="shuffle"
              className="object-fill w-full h-full"
            />
          </button>
          <button
            onClick={handlePrev}
            className="w-10 h-10 hover:scale-105 transitions"
          >
            <img
              src="https://img.icons8.com/?size=100&id=0UynhOtfp5jz&format=png&color=000000"
              alt="previous"
              className="object-fill w-full h-full"
            />
          </button>
          {!playing ? (
            <button
              onClick={handlePlay}
              className="w-12 h-12 hover:scale-105 transitions"
            >
              <img
                src="https://img.icons8.com/?size=100&id=0SMLLlR49pHO&format=png&color=000000"
                alt="play"
                className="object-fill w-full h-full"
              />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="w-12 h-12 hover:scale-105 transitions"
            >
              <img
                src="https://img.icons8.com/?size=100&id=yhmKhhrffBS2&format=png&color=000000"
                alt="pause"
                className="object-fill w-full h-full"
              />
            </button>
          )}
          <button
            onClick={handleNext}
            className="w-10 h-10 hover:scale-105 transitions"
          >
            <img
              src="https://img.icons8.com/?size=100&id=OuZTvXPzLLA5&format=png&color=000000"
              alt="next"
              className="object-fill w-full h-full"
            />
          </button>
          <button
            onClick={handleRepeat}
            className="w-6 h-6 hover:scale-105 transitions"
          >
            <img
              src={
                "https://img.icons8.com/?size=100&id=foq7LhnV3sAw&format=png&color=" +
                (repeat ? "027682" : "000000")
              }
              alt="repeat"
              className="object-fill w-full h-full"
            />
          </button>
        </section>
        <section className="w-full flex gap-2">
          <span>{formatTime(duration * played)}</span>
          <input
            className="w-full"
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onChange={handleSeekChange}
          />
          <span>{formatTime(duration)}</span>
        </section>
      </div>
      <section className="flex w-full justify-center items-center gap-2">
        {mute ? (
          <button
            onClick={handleMute}
            className="w-6 h-6 hover:scale-105 transitions"
          >
            <img
              src="https://img.icons8.com/?size=100&id=ZjYBEad7HBKa&format=png&color=000000"
              alt="mute"
              className="object-fill w-full h-full"
            />
          </button>
        ) : (
          <button
            onClick={handleMute}
            className="w-6 h-6 hover:scale-105 transitions"
          >
            <img
              src="https://img.icons8.com/?size=100&id=az8n6pxuzg4r&format=png&color=000000"
              alt="mute"
              className="object-fill w-full h-full"
            />
          </button>
        )}
        <input
          type="range"
          min={0}
          max={1}
          step="any"
          value={volume}
          onChange={handleVolumeChange}
        />
      </section>
    </div>
  );
};

export default PlayerSong;

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};
