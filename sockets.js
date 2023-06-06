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
    // Socket.io disconnection event
    socket.on("disconnect", () => {
      // Remove disconnected user from the onlineUsers array
      console.log(`User ${socket.userId} disconnected.`);
      const index = onlineUsers.indexOf(socket.userId);
      if (index !== -1) {
        onlineUsers.splice(index, 1);
        adminNamespace.emit("onlineUsers", onlineUsers);
      }
    });
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

    socket.on("player", (data) => {
        const {player, room} = data
      console.log("player: ", player);
      socket.broadcast.emit("getPlayer", player);
    });

    // Socket.io disconnection event
    socket.on("disconnect", () => {
      console.log("user disconnected from game");
    });
  });
};

module.exports = socketServer;
