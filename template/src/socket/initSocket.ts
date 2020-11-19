import Socket from "socket.io-client";

const SOCKET_URL = "http://localhost:3132";

export const initSocket = () => {
  const socket: SocketIOClient.Socket = Socket.connect(SOCKET_URL);

  socket.on("connect", () => {
    console.log("connected");
  });
  socket.on("error", (error: any) => {
    console.log("SocketError: ", error);
  });
  socket.on("disconnect", () => {
    console.log("disconnected");
  });

  return socket;
};
