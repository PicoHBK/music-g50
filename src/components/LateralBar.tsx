import { useNavigate } from "react-router-dom";

function LateralBar() {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col w-full items-center max-w-64 min-h-screen bg-myprim-50 font-lato gap-5">
        <h2 className="font-extrabold text-3xl text-myprim-700 break-words ">
            G50
        </h2>
        <section className="flex flex-col w-full gap-3 pl-2">
            <button className="flex w-full gap-3 hover:scale-105 transition" onClick={() => navigate("/")} >
                <div className="w-6 h-6">
                    <img src="https://img.icons8.com/?size=100&id=2797&format=png&color=03A3A1" alt="home" className="w-full h-full" />
                </div>
                <h5 className="text-myprim-800">
                    Home
                </h5>
            </button>
            <button className="flex w-full gap-3 hover:scale-105 transition" onClick={() => navigate("/login")}>
                <div className="w-6 h-6">
                    <img src="https://img.icons8.com/?size=100&id=3685&format=png&color=03A3A1  " alt="home" className="w-full h-full" />
                </div>
                <h5 className="text-myprim-800">
                    Descubrir
                </h5>
            </button>

        </section>
        <section className="flex flex-col w-full gap-3 pl-2">
            <h5 className="font-semibold text-sm text-myprim-700 break-words">User</h5>
            <section className="flex flex-col w-full gap-3 pl-2">
            <button className="flex w-full gap-3 hover:scale-105 transition items-center" onClick={() => navigate("/songs")}>
                <div className="w-4 h-4">
                    <img src="https://img.icons8.com/?size=100&id=CuzQd42Ll50P&format=png&color=03A3A1" alt="home" className="w-full h-full" />
                </div>
                <h5 className="text-myprim-800 text-[11px]">
                    Canciones
                </h5>
            </button>
            <button className="flex w-full gap-3 hover:scale-105 transition items-center" onClick={() => navigate("/albums")}>
                <div className="w-4 h-4">
                    <img src="https://img.icons8.com/?size=100&id=X3HaDEEtptM_&format=png&color=03A3A1" alt="home" className="w-full h-full" />
                </div>
                <h5 className="text-myprim-800 text-[11px]">
                    Albums
                </h5>
            </button>
            <button className="flex w-full gap-3 hover:scale-105 transition items-center" onClick={() => navigate("/artists")}>
                <div className="w-4 h-4">
                    <img src="https://img.icons8.com/?size=100&id=24851&format=png&color=03A3A1" alt="home" className="w-full h-full" />
                </div>
                <h5 className="text-myprim-800 text-[11px]">
                    Artistas
                </h5>
            </button>
            <button className="flex w-full gap-3 hover:scale-105 transition items-center" onClick={() => navigate("/genres")}>
                <div className="w-4 h-4">
                    <img src="https://img.icons8.com/?size=100&id=f6N0ObuRcP91&format=png&color=03A3A1" alt="home" className="w-full h-full" />
                </div>
                <h5 className="text-myprim-800 text-[11px]">
                    Generos
                </h5>
            </button>
            <button className="flex w-full gap-3 hover:scale-105 transition items-center" onClick={() => navigate("/playlists")}>
                <div className="w-4 h-4">
                    <img src="https://img.icons8.com/?size=100&id=31453&format=png&color=03A3A1" alt="home" className="w-full h-full" />
                </div>
                <h5 className="text-myprim-800 text-[11px]">
                    Play Lists
                </h5>
            </button>
            

        </section>

        </section>
      
    
    </div>
  );
}

export default LateralBar;
