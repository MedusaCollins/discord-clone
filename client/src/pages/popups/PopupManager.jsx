import React, { useState } from 'react'
import ServerSettings from './menus/ServerSettings'
import ChannelSettings from './menus/ChannelSettings'
import CreateChannel from './CreateChannel'
import ServerInvite from './ServerInvite'
import UserBan from './UserBan'

const PopupManager = ({input, setInput, selected, selectedServer, popup, setPopup, access}) => {
  const [filterMenu, setFilterMenu] = useState({
    userPopup: false,
    banPopup: false,
    selectedUser: [],
    user: "",
  })

  return (
    <div className={`fixed inset-0 z-50 ${popup.showPopup ? 'flex' : 'hidden'} items-center justify-center bg-[#000000] bg-opacity-60`} onClick={() => setPopup({...popup, showPopup: false})}>
      <div className="relative bg-[#313338] rounded-md shadow-md mx-5" onClick={(e) => e.stopPropagation()}>
        <div className="text-center sm:w-96">
          {/* ServerSettings menüsüne gerekli params değerlerini taşımamız gerekli */}
          {selectedServer.channels !== undefined && selectedServer.channels !== null ?(
            <div>
              {popup.serverSettings && (<ServerSettings selected={selected} input={input} setInput={setInput} selectedServer={selectedServer} setPopup={setPopup} popup={popup} filterMenu={filterMenu} setFilterMenu={setFilterMenu}/>)}
              {popup.serverInvite && (<ServerInvite selected={selected} input={input} setInput={setInput} selectedServer={selectedServer} setPopup={setPopup} popup={popup} access={access}/>)}
              {filterMenu.banPopup && (<UserBan selected={selected} input={input} setInput={setInput} selectedServer={selectedServer} setPopup={setPopup} popup={popup} filterMenu={filterMenu} setFilterMenu={setFilterMenu}/>)}
              {popup.createChannel && (<CreateChannel selected={selected} input={input} setInput={setInput} selectedServer={selectedServer} setPopup={setPopup} popup={popup} access={access}/>)}
              {popup.channelSettings && (<ChannelSettings selected={selected} input={input} setInput={setInput} selectedServer={selectedServer} setPopup={setPopup} popup={popup}/>)}
            </div>
          ):null}
        </div>
      </div>
    </div>
  )
}

export default PopupManager