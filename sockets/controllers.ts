import * as socketIO from 'socket.io';
import { verifyJwtInSocket } from '../helpers';
import { UserModel } from '../models';
import ChatMessages from '../models/chat-messages';

const chatMessages = new ChatMessages();

export const socketController = async (socket: socketIO.Socket, io: socketIO.Server) => {

    const token = socket.handshake.headers['x-token'] as string;

    const user = await verifyJwtInSocket(token);

    if (!user) {
        return socket.disconnect();
    }

    // Cuando un cliente se conecta se crea el socket se enlaza a dos salas: 
    // 1.- Sala global (le llegan los mensajes a todos a través de "io")
    // 2.- Sala con su propio id (le llegan los mensajes al propio que se conectó a través de "socket")

    console.log('Se conectó', user.name);

    chatMessages.connectUser(user);
    io.emit('users-actives', chatMessages.usersToArray);
    socket.emit('receive-messages', chatMessages.lastMessages);

    // Ahora, se puede conectar a una sala en especial, con esto el socket se enlaza a 3 salas. Esta nueva sala tiene como identificador el id del user
    socket.join(user.id);   

    socket.on('disconnect', () => {
        console.log('Se desconectó', user.name)
        chatMessages.disconnectUser(user.id);
        io.emit('users-actives', chatMessages.usersToArray);
    });

    

    /**
     * id: id destinatario
     * message: mensaje para destinatario
     */

    socket.on('send-message', async ({message, id}) => {

        if (id) { // Mensaje privado

            const userReceiver = await UserModel.findById(id);

            chatMessages.sendMessage(user.id, user.name, message, id);
            socket.to(id).emit('message-private', { 
                receiverName: user.name, 
                receiverId: user.id,
                chats: chatMessages.lastMessagesPrivateByUsers(user.id, id)
            });
            socket.emit('message-private', {
                receiverName: userReceiver?.name,
                receiverId: userReceiver?.id,
                chats: chatMessages.lastMessagesPrivateByUsers(user.id, id)
            });

        } else {
            chatMessages.sendMessage(user.id, user.name, message, '');
            io.emit('receive-messages', chatMessages.lastMessages);
        }        

    })
    
    
};