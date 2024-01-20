import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { MobileNavigation } from './MobileNavigation';

const Users = (params) => {
  const {selectedServer, selected, setSelected} = params
  const getRoleCount = (roleName) => {
    return selectedServer.serverUsers.filter(user => user.roles[0] === roleName).length;
  };

  return (
    <div className={`${selected.serverID !== null && selectedServer !== "" ? 'sm:w-[200px] sm:min-w-[200px] w-full':null} ${selected.focus === "right" || selected.focus === "all" ? 'block': 'hidden'} h-screen bg-black-200`}>
      {selected.serverID !== null && selectedServer !== "" ? (
        <MobileNavigation selected={selected} setSelected={setSelected} selectedServer={selectedServer}/>
      ):null}

      {selected.serverID !== null && selectedServer !== "" ? (
        <div className={selected.serverID !== null && selectedServer !== "" ? (window.innerWidth < 640 ? 'mt-16': 'mt-5') : null}>
          {selectedServer.serverRoles.map((roles, index) => (
            selectedServer.serverUsers.some(user => user.roles[0] === roles.name) ? (
              <div key={index} className='text-sm'>
                <span className='mx-5 mt-4 flex text-gray-200'>{roles.name} - {getRoleCount(roles.name)}</span>
                {selectedServer.serverUsers.map((user, userIndex) => (
                  user.roles[0] === roles.name ? (
                    <div key={userIndex} className="flex items-center h-10 mt-1 pl-3 mx-2 rounded-md cursor-pointer bg-black-200 hover:bg-black-300">
                      <img className="w-7 h-7 rounded-full" src={user.imageUrl} alt="user" />
                      <p className="ml-2 text-sm" style={{ color: `${roles.color}` }}>{user.name} {selectedServer.owner === user.email && <FontAwesomeIcon icon={faCrown} className='text-orange-400'/>}</p>
                    </div>
                  ) : null
                ))}
              </div>
            ) : null
          ))}
        </div>
      ) : null}
    </div>
  );
};

  export default Users;
