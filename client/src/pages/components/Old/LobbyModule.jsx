import React, { useEffect, useState} from 'react';
import { io } from 'socket.io-client';

const LobbyModule = (props) => {
  const socket = io(process.env.REACT_APP_SERVER);
  const [showDiv, setShowDiv] = useState(false);
  const {user, setRooms } = props;
  const [Lobby, setLobby] = useState({
    name: 'test',
    tags: [''],
    players: [],
    host: user,
    mode: 'Classic Tak-On',
    status: 'Waiting',
    password: '',
    maxPlayer: '8',
  });

  function createLobby(Lobby){
    // console.log(Lobby)
    socket.emit('create lobby', Lobby)
  }

  
  function input(placeholder, onChange) {
    return (
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => setLobby({ ...Lobby, [onChange]: e.target.value })}
        className="w-full px-4 py-2 text-base rounded-xl outline-none bg-[#343a40] focus:ring-green-500 focus:ring-2 transition"
      />
    );
  }

  return (
    <div className='text-white flex gap-5 items-center mx-auto place-content-center'>
      <button onClick={() => setShowDiv(true)} className='p-2 bg-blue-500 hover:bg-blue-600 rounded-lg'>
        New Game
      </button>
      <button className='p-2 bg-green-500 hover:bg-green-600 rounded-lg'>Quick Join</button>

      {showDiv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all" onClick={() => setShowDiv(false)}>
          <div className="relative bg-white dark:bg-[#212529] p-4 rounded-xl shadow-md mx-5" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 text-black dark:text-[#dee2e6] text-center sm:w-96 flex flex-col gap-3">
              {input('Lobby Name', 'name')}
              {input('Tags', 'tags')}
              {input('Password', 'password')}
              <div className='flex gap-5'>
                <div>
                  <label>Max Players</label>
                  <select name="text" value={Lobby.maxPlayer} onChange={(e) => setLobby({ ...Lobby, maxPlayer: e.target.value })} className="w-full px-1 py-2 text-base rounded-xl outline-none bg-[#343a40] focus:ring-green-500 focus:ring-2 transition resize-none">
                    <option value="8">8</option>
                    <option value="4">4</option>
                    <option value="2">2</option>
                  </select>
                </div>
                <div>
                  <label>Game Mode</label>
                  <select name="text" value={Lobby.mode} onChange={(e) => setLobby({ ...Lobby, mode: e.target.value })} className="w-full px-1 py-2 text-base rounded-xl outline-none bg-[#343a40] focus:ring-green-500 focus:ring-2 transition resize-none">
                    <option value="Classic Tak-On">Classic Tak-On</option>
                    <option value="Chaos Tak-On">Chaos Tak-On</option>
                  </select>
                </div>
              </div>
              <button type="submit" onClick={() => createLobby(Lobby)} className='bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-2xl transition mt-4'>
                Create Lobby
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LobbyModule;
