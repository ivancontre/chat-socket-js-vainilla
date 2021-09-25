import express from 'express';
import cors from 'cors';
import * as socketIO from 'socket.io';
import { createServer, Server as ServerHttp } from 'http';

import fileUpload from 'express-fileupload';

import { dbConnection } from '../database/config';

import { socketController } from '../sockets/controllers';

export default class Server {
    app: express.Application;
    port: string;
    paths: any;
    server: ServerHttp;
    io: socketIO.Server

    constructor() {
        
        this.app = express();
        this.port = process.env.PORT as string;
        this.server = createServer(this.app);
        this.io = new socketIO.Server(this.server);

        this.paths = {
            users: '/api/users',
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/upload'
        };

        // Conectar a base de datos
        this.connectToDB();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();

        // Sockets
        this.sockets();
    }

    async connectToDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Indica el tipo de dato que vendrá
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));

        // Fileupload -carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {       

        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.users, require('../routes/user'));
        this.app.use(this.paths.categories, require('../routes/category'));
        this.app.use(this.paths.products, require('../routes/product'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/upload'))

    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));

    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${ this.port }`);
        });
    }
}