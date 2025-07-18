import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();


app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io  = new Server(httpServer);
  io.on("connection", (socket)=>{
    console.log(`user connected ${socket.id}`)

     socket.on('join-room', ({ roomId }) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('toggle-editor', ({ isOpen }) => {
    console.log("🟩 Server received toggle-editor:", isOpen);
    io.emit('toggle-editor', { isOpen });
  });

    socket.on('code-change', ({ code }) => {
    console.log('code-change');
    socket.broadcast.emit('code-change', { code });
  });

    socket.on('run-code', ({ sourceCode, language }) => {
      io.emit('run-code', {sourceCode,language}); 
  });

    socket.on("disconnect", ()=>{
    console.log(`User disconnected ${socket.id}`)
  })
  });


  

  httpServer.listen(port,()=>{
    console.log(`server is running on port http://${hostname}:${port}`)
  });
});