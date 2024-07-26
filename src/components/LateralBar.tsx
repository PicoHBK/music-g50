import { useNavigate } from "react-router-dom";

function LateralBar() {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col w-full items-center max-w-64 min-h-screen bg-myprim-50 font-lato">
        <h2 className="font-extrabold text-3xl text-myprim-700 break-words ">
            G50
        </h2>
        <h2 className="font-extrabold text-3xl text-myprim-700 break-words ">
            MUSIC
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
      
    
    </div>
  );
}

export default LateralBar;
