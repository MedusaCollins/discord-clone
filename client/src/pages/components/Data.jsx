const data = [
{
    name: 'Meduware',
    image: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c',
    channels: [
        {
            name: 'Generalchat',
            type: 'text',
            access: {read: ['Owner','Admin','Moderator','Member','Guest'], write: ['Owner','Admin','Moderator','Member']},
            messages: 
                [
                    {
                        message: 'Hello World', 
                        user:{name: 'Medusa Collins',email: 'collinsmedusa@gmail.com',imageUrl:'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c'}
                    },
                    {
                        message: 'Hello World', 
                        user:{name: 'Medusa Collins',email: 'collinsmedusa@gmail.com',imageUrl:'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c'}
                    }
                ]
        },
        {
            name: 'Generalvc',
            type: 'voice',
            access: {read: ['Owner','Admin','Moderator','Member','Guest'], write: ['Owner','Admin','Moderator','Member']},
            messages: 
                [
                    {
                        message: 'Hello Worldaa', 
                        user:{name: 'Medusa Collinss',email: 'collinsmedusa@gmail.com',imageUrl:'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c'}
                    }
                ]
        }
    ],
    serverUsers: [
        {
            name: 'Medusa Collins',email: 'collinsmedusa@gmail.com',imageUrl:'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c'
        }
    ],
    serverRoles: [
        {
            name: 'Owner',
            color: '#FF0000',
            access: {
                manageServer: true,
                manageChannels: true,
                manageRoles: true,
                manageUsers: true,
                manageMessages: true,
                manageVoice: true,
                manageEmojis: true,
            }
        },
        {
            name: 'Admin',
            color: '#FF0000',
            access: {
                manageServer: false,
                manageChannels: false,
                manageRoles: false,
                manageEmojis: false,
                manageUsers: true,
                manageMessages: true,
                manageVoice: true,
            }
        },
        {
            name: 'Moderator',
            color: '#FF0000',
            access: {
                manageServer: false,
                manageChannels: false,
                manageRoles: false,
                manageEmojis: false,
                manageUsers: false,
                manageMessages: true,
                manageVoice: true,
            }
        },
        {
            name: 'Member',
            color: '#FF0000',
            access: {
                manageServer: false,
                manageChannels: false,
                manageRoles: false,
                manageEmojis: false,
                manageUsers: false,
                manageMessages: false,
                manageVoice: true,
            }
        },
        {
            name: 'Guest',
            color: '#FF0000',
            access: {
                manageServer: false,
                manageChannels: false,
                manageRoles: false,
                manageEmojis: false,
                manageUsers: false,
                manageMessages: false,
                manageVoice: false,
            }
        },
    ]
}
];

export default data;
