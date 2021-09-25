class Message {
    uid: string;
    name: string;
    message: string;
    date: number;
    to?: string;

    constructor(uid: string, name: string, message: string) {
        this.uid = uid;
        this.name = name;
        this.message = message;
        this.date = new Date().getTime();
    }
}

export default class ChatMessages {
    messages: Message[];
    users: any;
    privateMessages: any;


    /**
     * privateMessages =
     * 
     * {
     *      "id1_id2": [msg1, msg2]
     *      
     * }
     * 
     * 
     */

    constructor() {
        this.messages = [];
        this.users = {};
        this.privateMessages = {};
    }

    get lastMessages() {
        this.messages = this.messages.splice(0, 10);
        return this.messages
    }

    get usersToArray() {
        return Object.values(this.users);
    }

    private existsMessagesPrivates(uid: string, receiverId: string) {

        if (this.privateMessages[uid + '_' + receiverId]) {
            return uid + '_' + receiverId;
        }

        if (this.privateMessages[receiverId + '_' + uid]) {
            return receiverId + '_' + uid;
        }

        return '';

    }

    lastMessagesPrivateByUsers(uid: string, receiverId: string) {


        const key = this.existsMessagesPrivates(uid, receiverId);

        if (!key) {
            return [];
        }

        return this.privateMessages[key];

    }

    sendMessage(uid: string, name: string, message: string, receiverId: string) {

        const msg: Message = new Message(uid, name, message);

        if (!receiverId) { // Si es público
            
            this.messages = [msg, ...this.messages];

        } else {

            let key = this.existsMessagesPrivates(uid, receiverId);

            if (!key) {
                key = uid + '_' + receiverId;
                this.privateMessages[key] = [];
                
            }

            
            this.privateMessages[key] = [msg, ...this.privateMessages[key]];

        }
        
    }

    connectUser(user: any) {
        this.users[user.id] = user;
    }

    disconnectUser(uid: string) {
        delete this.users[uid];
    }
}