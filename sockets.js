const allPlayers = [];
const allCol = {};
let usersNum = 0;

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
    socket.on("getUserNum", (data) => {
      const { id } = data;
      userNamespace.emit("getUserNum", {id: id, num: usersNum});
      usersNum++;
      if (usersNum === 2) usersNum = 0;
    });
    socket.on("updateRole", (data) => {
      const { cardId, right } = data;
      userNamespace.emit("updateRole", data);
    });
    socket.on("updateRoom", (data) => {
      userNamespace.emit("updateRoom", data);
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
      const findPlayer = allPlayers.indexOf((p) => p.id === player.id);
      if (findPlayer === -1 && allPlayers.length < 2) {
        allPlayers.push(player);
      }
      else if (findPlayer !== -1) {
        allPlayers[findPlayer] = player;
      }
      gameNamespace.to(room).emit("getAllPlayers", {players: allPlayers});
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
      gameNamespace.to(room).emit("matchWon", winnerName);
    });

    socket.on("getAllCol", (data) => {
      const {col, room} = data;
      allCol[col.id] = col;
      gameNamespace.to(room).emit("getAllCol", allCol);
    });

    socket.on("deleteCol", (data) => {
      const {colId, room} = data;
      gameNamespace.to(room).emit("deleteCol", colId);
    });

    socket.on("updateCol", (data) => {
      const {colId, top, left, room} = data;
      gameNamespace.to(room).emit("updateCol", data);
    });

    // socket.on("removedPlayer", (data) => {
    //   const {playerId, room} = data
    //   const findPlayer = allPlayers.indexOf((p) => p.id === playerId);
    //   allPlayers.splice(findPlayer, 1);
    //   console.log("bla");
    //   gameNamespace.to(room).emit("removedPlayer", data);
    // });

    // socket.on("player", (data) => {
    //     const {player, room} = data
    //   console.log("player: ", player);
    //   socket.broadcast.emit("getPlayer", player);
    // });

    // Socket.io disconnection event
    socket.on("disconnect", () => {
      console.log("user disconnected from game");
    });
  });
};

module.exports = socketServer;