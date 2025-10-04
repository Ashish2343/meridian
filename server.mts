import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
// != production

const dev = process.env.NODE_ENV === "production";
const hostname = "0.0.0.0";
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

    socket.onAny((event, payload) => {
    console.log(`📩 Server received event: ${event}`, payload);
    });

    socket.on('toggle-editor', ({ isOpen }) => {
    console.log("🟩 Server received toggle-editor:", isOpen);
    io.emit('toggle-editor', { isOpen });
  });

    socket.on('code-change', ({ code, roomId }) => {
    console.log('code-change');
    socket.to(roomId).emit('code-change', { code });
  });

    socket.on('code-result', ({ output, stderr, roomId }) => {
    socket.broadcast.to(roomId).emit('code-result', { output, stderr });
  });

    socket.on('language-change', (data) => {
    console.log(`🟩 Server received language-change:`, data);
    const { language, roomId } = data;
    socket.to(roomId).emit('language-change', { language });
});


    socket.on("disconnect", ()=>{
    console.log(`User disconnected ${socket.id}`)
  })
  });


  

  httpServer.listen(port,()=>{
    console.log(`server is running on port http://${hostname}:${port}`)
  });
});