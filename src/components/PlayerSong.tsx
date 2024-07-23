import { useState } from "react";
import { useSongsContext } from "../hooks/usePlayerSong";

const PlayerSong = () => {
  const [playing, setPlaying] = useState(true);
  const handlePlay = () => {
    setPlaying(!playing);
  };

  const {state} = useSongsContext()


  return (
    <div className="flex fixed bottom-0 left-0 w-full bg-myprim-50 p-4 min-h-24 justify-around">
      <section className="flex w-full justify-center items-center gap-2">
        <button onClick={handlePlay} className="w-12 h-12">
          <img
            src="https://img.icons8.com/?size=100&id=0is6nw0hGPP7&format=png&color=000000"
            alt="album"
            className="object-fill w-full h-full"
          />
        </button>
        <div className="flex flex-col">
            <p className="text-sm font-bold">
                {state.song?.title}
            </p>
            <p  className="text-sm font-normal">
                Artista
            </p>
        </div>
      </section>
      <section className="flex w-full justify-center items-center gap-4">
        <button onClick={handlePlay} className="w-6 h-6 hover:scale-105 transitions">
          <img
            src="https://img.icons8.com/?size=100&id=Rbxyhe2VwSBi&format=png&color=000000"
            alt="sufle"
            className="object-fill w-full h-full"
          />
        </button>
        <button onClick={handlePlay} className="w-10 h-10 hover:scale-105 transitions">
          <img
            src="https://img.icons8.com/?size=100&id=0UynhOtfp5jz&format=png&color=000000"
            alt="previous"
            className="object-fill w-full h-full"
          />
        </button>
        <button onClick={handlePlay} className="w-12 h-12 hover:scale-105 transitions">
          <img
            src="https://img.icons8.com/?size=100&id=0SMLLlR49pHO&format=png&color=000000"
            alt="play"
            className="object-fill w-full h-full"
          />
        </button>
        <button onClick={handlePlay} className="w-10 h-10 hover:scale-105 transitions">
          <img
            src="https://img.icons8.com/?size=100&id=OuZTvXPzLLA5&format=png&color=000000"
            alt="next"
            className="object-fill w-full h-full"
          />
        </button>
        <button onClick={handlePlay} className="w-6 h-6 hover:scale-105 transitions">
          <img
            src="https://img.icons8.com/?size=100&id=foq7LhnV3sAw&format=png&color=000000"
            alt="repeat"
            className="object-fill w-full h-full"
          />
        </button>
      </section>
      <section className="flex w-full justify-center items-center gap-2">
        <button onClick={handlePlay} className="w-6 h-6 hover:scale-105 transitions">
          <img
            src="https://img.icons8.com/?size=100&id=ZjYBEad7HBKa&format=png&color=000000"
            alt="mute"
            className="object-fill w-full h-full"
          />
        </button>
      </section>
    </div>
  );
};

export default PlayerSong;
