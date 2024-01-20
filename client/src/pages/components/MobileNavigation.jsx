import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUsers } from '@fortawesome/free-solid-svg-icons';

export const MobileNavigation = ({ selectedServer, selected, setSelected }) => {
    const [selectedChannel, setSelectedChannel] = useState(null);
      useEffect(() => {
    if (selectedServer !== "" && selected.channelID !== null) {
      setSelectedChannel(selectedServer.channels.find(channel => channel._id === selected.channelID))
    }
  }, [selectedServer, selected]);

  const truncateText = (text) => {
  let limit = window.innerWidth < 450 ? 25 : 38;
  if (text.length > limit) {
    return text.slice(0, limit) + '...';
  }
  return text;
};
    return (
        ((selected.focus === 'center' || selected.focus === "right")) && (window.innerWidth < 640) && selectedChannel !== null ? (
            <div className='w-full h-[60px] items-center text-sm px-5 py-2 flex bg-black-100 border-b-2 border-b-black-300 fixed z-30'>
                <FontAwesomeIcon icon={faBars} className='text-white p-4 -ml-4' onClick={()=> setSelected({...selected, focus: "left"})}/>
                <p className='text-white items-center flex'><span className='text-gray-100 text-2xl mx-2'>#</span> {truncateText(selectedChannel.name)}</p>
                {selected.focus === "center" ? 
                <FontAwesomeIcon icon={faUsers} className='text-gray-100 p-4 ml-auto -mr-4' onClick={()=> setSelected({...selected, channelID:null, focus: "right"})}/> :
                <FontAwesomeIcon icon={faUsers} className='text-white p-4 ml-auto -mr-4' onClick={()=> setSelected({...selected, focus: "center"})}/>}
            </div>
        ): null
    );
};
