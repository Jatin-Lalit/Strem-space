const app=require("express")()
const server=require("http").createServer(app)
const io=require("socket.io")(server)
let arr=[]
io.on("connect",(socket)=>{
    console.log(socket.id)
    socket.on("jroom",(data)=>{
        const user=jroom(socket.id,data.name,data.roomno)
        let name=`${user.name} has joined chat `
        let room=user.room
        socket.join(user.room)
        socket.broadcast.emit("welcome_msg",({
            name,
            room
        }))
        io.to(room).emit("room_no",room)
        socket.on("msg",(data)=>{
            let room=data.room
            io.to(room).emit("incoming_msg",data)
        })
        socket.on("exit",(data)=>{
            socket.broadcast.emit("exit_msg",`${data.name} has leaved the Chat`)
        })
    })
})

function jroom(id,name,room) {
    let obj={
        id,
        name,
        room
    }
    arr.push(obj)
    return obj
}

server.listen(5050,()=>console.log("server running..."))