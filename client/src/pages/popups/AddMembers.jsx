import React, { useState, useEffect} from 'react'
import {io} from 'socket.io-client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons';

const AddMembers = ({selectedServer, input, setInput, popup, setPopup, access}) => {
const [socket, setSocket] = useState(null);
useEffect(() => {
  const socket = io(process.env.REACT_APP_SERVER);
  setSocket(socket);
}, []);
function AddMember(){
    socket.emit("addRole", {serverID: selectedServer._id, role: input.roleName, users: input.addRole})
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-white bg-[#000000] bg-opacity-60" onClick={() => (setPopup({...popup, addMembers: false}), setInput({...input, addRole: []}))}>
        <div className="relative bg-[#313338] rounded-md shadow-md mx-5" onClick={(e) => e.stopPropagation()}>
          <div className="text-center sm:w-96">
              <div className='p-4 flex flex-col text-center'>
                <p className='text-xl font-semibold text-white'>Add Members</p>
                <p className='text-gray-100'><FontAwesomeIcon icon={faCircle} style={{color: input.roleColor}}/> {input.roleName}</p>
              </div>
              <div className='text-left p-4'>
                <label htmlFor="members" className="block text-ssm font-bold leading-6 text-white">
                  MEMBERS
                </label>
                {selectedServer.serverUsers.map(user => user.roles[0] !== input.roleName ? (
                  <div
                    key={user.email}
                    className="flex items-center gap-2 hover:bg-black-hover p-2"
                    onClick={() =>
                      input.addRole?.includes(user.email)
                        ? (() => {
                            const updatedAddRole = (input.addRole || []).filter(
                              (email) => email !== user.email
                            );
                            setInput({ ...input, addRole: updatedAddRole });
                          })()
                        : setInput({ ...input, addRole: [...(input.addRole || []), user.email] })
                    }
                  >
                    <FontAwesomeIcon icon={input.addRole?.includes(user.email) ? faSquareCheck : faSquare}/> <img src={user.imageUrl} alt="user" className='rounded-full w-8'/>{user.name}
                  </div>
                ) : null)}
              </div>
              
              <div className='flex p-4 justify-end gap-5 rounded-b-xl bg-black-200'>
                <button onClick={() => (setPopup({...popup, addMembers: false}), setInput({...input, addRole: []}))} className='hover:underline text-ssm'>Cancel</button>
                <button onClick={()=> AddMember()}  className='text-white text-ssm px-7 py-2 rounded-sm bg-blue-50 hover:bg-blue-200'>Add</button>
              </div>
          </div>
        </div>
        </div>
  )
}

export default AddMembers