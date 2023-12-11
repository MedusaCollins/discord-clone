import Chat from "./components/Chat";
import Lobby from "./components/Lobby";
import LobbyModule from "./components/LobbyModule";

export default function Home(props) {
   
    return(
        <div className="relative h-full">
            <div className="absolute top-0 w-full">
            <Lobby props={props}/>
            </div>
            <div className="absolute bottom-0 w-full">
            <LobbyModule props={props}/>
            <Chat props={props}/>
            </div>
        </div>
    );
}