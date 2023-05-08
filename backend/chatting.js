const app=require("express")()
const server=require("http").createServer(app)
const io=require("socket.io")(server)
let arr=[]
io.on("connection",(socket)=>{
    console.log(socket.id)
    socket.on("joinroom",(data)=>{
        const user=joinroom(socket.id,data.name,data.roomno)
        let name=`${user.name} has joined chat `
        let room=user.room
        socket.join(user.room)
        socket.broadcast.emit("welcomemsg",({
            name,
            room
        }))
        io.to(room).emit("roomno",room)
        socket.on("msg",(data)=>{
            let room=data.room
            io.to(room).emit("incomingmsg",data)
        })
        socket.on("exit",(data)=>{
            socket.broadcast.emit("exitmsg",`${data.name} has leaved the Chat`)
        })
    })
})

function joinroom(id,name,room) {
    let obj={
        id,
        name,
        room
    }
    arr.push(obj)
    return obj
}

server.listen(4500,()=>console.log("server running..."))