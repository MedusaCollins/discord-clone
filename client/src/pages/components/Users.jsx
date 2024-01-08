import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Users = (params) => {
  const {selectedServer, selected} = params
  const getRoleCount = (roleName) => {
    return selectedServer.serverUsers.filter(user => user.roles[0] === roleName).length;
  };

  return (
    <div className={`${selected.serverID !== null && selectedServer !== "" ? 'w-[10%]':null} h-screen bg-black-200`}>
      {selected.serverID !== null && selectedServer !== "" ? selectedServer.serverRoles.map((roles, index) => (
        selectedServer.serverUsers.some(user => user.roles[0] === roles.name) ? (
          <div key={index} className='text-sm mt-5'>
            <span className='mx-5 text-gray-200'>{roles.name} - {getRoleCount(roles.name)}</span>
            {selectedServer.serverUsers.map((user, index) => (
              user.roles[0] === roles.name ? (
                  <div key={index} className="flex items-center h-10 mt-1 pl-3 mx-2 rounded-md cursor-pointer bg-black-200 hover:bg-black-300">
                    <img className="w-7 h-7 rounded-full" src={user.imageUrl} alt="user" />
                    <p className="ml-2 text-sm" style={{ color: `${roles.color}` }}>{user.name} {selectedServer.owner === user.email && <FontAwesomeIcon icon={faCrown} className='text-orange-400'/>}</p>
                  </div>
              ) : null
            ))}
          </div>
        ) : null
      )) : null}
    </div>
  );
};

  export default Users;
