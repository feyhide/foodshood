import fastifySession from "@fastify/session";
import "dotenv/config";
import connect from 'connect';  // Ensure this import is present
import { Admin } from "../models/index.js";
import ConnectMongoDBSession from "connect-mongodb-session";

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "session",
});

sessionStore.on("error", (error) => {
    console.log("SESSION STORE ERROR ", error);
});

export const authenticate = async (email, password) => {
    if(email && password){
        const user = await Admin.findOne({email})
        if(!user){
            return null
        }
    }
    if (user.password === password) {
        return Promise.resolve({ email, password });
    } else {
        return null;
    }
};

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
