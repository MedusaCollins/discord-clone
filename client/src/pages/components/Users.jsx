      import React from 'react';
      import data from './Data';

      const Users = (params) => {
        const selected = params.selected;
        const selectedServer = data.find(server => server.serverID === selected.serverID);

        const getRoleCount = (roleName) => {
          return selectedServer.serverUsers.filter(user => user.roles[0] === roleName).length;
        };

        return (
          <div className="w-[10%] h-screen bg-black-200 ">
            {selectedServer !== null ? selectedServer.serverRoles.map((roles, index) => (
              selectedServer.serverUsers.some(user => user.roles[0] === roles.name) ? (
                <div key={index} className='text-sm mt-5'>
                  <span className='mx-5 text-gray-200'>{roles.name} - {getRoleCount(roles.name)}</span>
                  {selectedServer.serverUsers.map((user, index) => (
                    user.roles[0] === roles.name ? (
                        <div key={index} className="flex items-center justify-center h-10 mx-2 rounded-md cursor-pointer bg-black-200 hover:bg-black-300">
                          <img className="w-7 h-7 rounded-full" src={user.imageUrl} alt="user" />
                          <p className="ml-2 text-sm" style={{ color: `${roles.color}` }}>{user.name}</p>
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
