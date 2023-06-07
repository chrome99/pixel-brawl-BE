let allUsers = {};
let allPlayers = {};
let allCol = {};

const socketServer = (io) => {
  // Array to store online user IDs
  let onlineUsers = [];

  // Namespace for user connections
  const userNamespace = io.of("/users");

  userNamespace.on("connection", (socket) => {
    // Event to save user ID in the onlineUsers array
    socket.on("userConnected", (userId) => {
      console.log("user", userId, "connected");
      if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId);
        adminNamespace.emit("onlineUsers", onlineUsers);
      }
      socket.userId = userId; // Set the userId as a property on the socket
    });
    socket.on('joinMyRoom', (userId) => {
      console.log(`Socket ${socket.id} joining personal room ${userId}`);
      socket.join(userId);

   });
    socket.on('joinRoom', (data) => {
      const {userId, username, room} = data;

      //get number of clients in room
      let clientNumber = 0;
      const getRoom = userNamespace.adapter.rooms.get(room);
      if (getRoom) {
        const clientsArray = Array.from(getRoom);
        clientNumber = clientsArray.length;
      };

      if (clientNumber === 0) {
        allUsers[room] = {};
      }

      //if there is already 2 clients in this room, block entry
      if (clientNumber < 2) {
        console.log(`Socket ${socket.id} joining ${room}`);
        socket.join(room);

        allUsers[room][clientNumber] = username;

        const dataToSend = {userId: userId, num: clientNumber, message: `${username} Joined room ${room}`};
        userNamespace.to(room).emit("joinRoom", dataToSend);
        if (clientNumber + 1 === 2) {
          userNamespace.to(room).emit("allAboard", allUsers[room]);
        }
      }
      else {
        userNamespace.to(userId).emit("joinRoom", `Room ${room} is occupied with ${clientNumber} users`);
      }
    });
    socket.on("updateRole", (data) => {
      const { cardId, right, room } = data;
      userNamespace.to(room).emit("updateRole", data);
    });
    // Socket.io disconnection event
    // socket.on("disconnect", () => {
    //   // Remove disconnected user from the onlineUsers array
    //   console.log(`User ${socket.userId} disconnected.`);
    //   const index = onlineUsers.indexOf(socket.userId);
    //   if (index !== -1) {
    //     onlineUsers.splice(index, 1);
    //     adminNamespace.emit("onlineUsers", onlineUsers);
    //   }
    // });
  });

  // Namespace for admin connections
  const adminNamespace = io.of("/admin");
  adminNamespace.on("connection", (socket) => {
    // Emit the onlineUsers array to the admin socket
    socket.emit("onlineUsers", onlineUsers);

    // Socket.io disconnection event
    socket.on("disconnect", () => {
      console.log("An admin disconnected.");
    });
  });

  // Namespace for game connections

  const gameNamespace = io.of("/game");
  gameNamespace.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);

    socket.on('joinRoom', (room) => {
        console.log(`Socket ${socket.id} joining ${room}`);
        socket.join(room);
     });

    socket.on("getAllPlayers", (data) => {
      const {player, room} = data
      // console.log("player: ", player);
      // console.log("room: ", room)
      if (allPlayers[room]) {
        allPlayers[room][player.id] = player;
      } else {
        allPlayers[room] = {};
        allPlayers[room][player.id] = player;
      }
      gameNamespace.to(room).emit("getAllPlayers", {players: allPlayers[room]});
    });

    socket.on("updatedPlayer", (data) => {
      const {player, room} = data
      // console.log("player: ", player);
      // console.log("room: ", room)
      gameNamespace.to(room).emit("updatedPlayer", data);
    });

    socket.on("takeDamage", (data) => {
      console.log("takeDamage");
      const {statsId, damage, room} = data;
      gameNamespace.to(room).emit("takeDamage", data);
    });

    socket.on("addScore", (data) => {
      const {playerId, room} = data;
      gameNamespace.to(room).emit("addScore", playerId);
    });

    socket.on("matchWon", (data) => {
      const {winnerName, room} = data;
      allPlayers[room] = {};
      allCol[room] = {};
      gameNamespace.to(room).emit("matchWon", winnerName);
    });

    socket.on("getAllCol", (data) => {
      const {col, room} = data;
      if (allCol[room]) {
        allCol[room][col.id] = col;
      } else {
        allCol[room] = {};
        allCol[room][col.id] = col;
      }
      gameNamespace.to(room).emit("getAllCol", allCol[room]);
    });

    socket.on("deleteCol", (data) => {
      const {colId, room} = data;
      gameNamespace.to(room).emit("deleteCol", colId);
    });

    socket.on("updateCol", (data) => {
      const {colId, top, left, room} = data;
      gameNamespace.to(room).emit("updateCol", data);
    });

    // Socket.io disconnection event
    socket.on("disconnect", () => {
      console.log("user disconnected from game");
    });
  });
};

module.exports = socketServer;