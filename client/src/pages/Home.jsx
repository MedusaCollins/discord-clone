import ServerSelect from "./components/ServerSelect";
import Channels from "./components/Channels";
import ChatBox from "./components/ChatBox";
import Users from "./components/Users";

export default function Home(props) {
    console.log(props.user)
    return(
        <div className="flex">
            <ServerSelect/>
            <Channels/>
            <ChatBox />
            <Users/>
        </div>
    )
}