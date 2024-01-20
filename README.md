<p align="center">
  <img src="https://makeanapplike.com/wp-content/uploads/2021/09/Discord-Clone-android-app-apk-1024x576.png" width="450px" height="250px"/> 
</p>

## Project Overview
This project is a Discord clone built using the MERN (MongoDB, Express.js, React, Node.js) stack. It incorporates various functionalities such as real-time messaging using Socket.IO, user authentication with Google, and a fully customizable server with roles, permissions, server visuals, server names, and a channel for new member announcements. Additionally, basic moderation capabilities are included.

## Screenshoots

<p align="center">
  <img src="https://github.com/MedusaCollins/discord-clone/assets/63819815/0cb9b699-866f-469f-b335-47caa4a8fa30" alt="Preview" width="450px" height="250px"/> 
  <img src="https://github.com/MedusaCollins/discord-clone/assets/63819815/aee49144-1a31-47cb-a7ed-50488c749d12" alt="Preview" width="450px" height="250px"/>
  <img src="https://github.com/MedusaCollins/discord-clone/assets/63819815/d4559859-7932-4bb6-a729-c03276bf1daf" alt="Preview" width="450px" height="250px"/>
</p>

## Technologies Used
  - [MongoDB](https://www.mongodb.com/): A NoSQL database for storing product and user information.</li>
  - [Express](https://github.com/expressjs/express): A Node.js web application framework for building the backend.</li>
  - [React](https://react.dev/): A JavaScript library for building the user interface.</li>
  - [NodeJS](https://nodejs.org/en): A JavaScript runtime environment for server-side scripting.</li>
  - [Socket.io](https://socket.io):A real-time engine for enabling bi-directional communication between web clients and servers. </li>
  - [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for creating a responsive and clean design.</li>

## Installation
 ```bash
git clone https://github.com/MedusaCollins/discord-clone.git
cd path/to/discord-clone/client
npm i
touch .env
cd path/to/discord-clone/server
npm i
mkdir uploads
touch .env
```

## Setup .env
##### client/.env
```
REACT_APP_NAME=Discord Clone
REACT_APP_IMG=https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg
REACT_APP_SERVER=http://localhost:3001
REACT_APP_CLIENTID=<Insert your Google OAuth 2.0 Client ID>
```

##### server/.env
```
CLIENT=http://localhost:3000
SERVER=http://localhost:3001
DB=<Paste your MongoDB connection string here>
```

## Run the Application
For the backend, run:
```
cd path/to/discord-clone/server
npm start
```

For the frontend, run:
```
cd path/to/discord-clone/client
npm start
```

## Contribution
Contributions are welcome! If you would like to contribute to the project, please follow these steps:

  - Fork the repository.
  - Create a new branch for your feature or bug fix.
  - Make your changes and commit them with clear and concise messages.
  - Push your changes to your fork.
 -  Submit a pull request to the main repository.

Feel free to contact the project maintainers for any questions or issues.
