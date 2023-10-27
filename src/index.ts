import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';


async function init() {
    const app = express();
    app.use(express.json());
    // creating gql server 
    const gqlServer = new ApolloServer({
        // schemas
        typeDefs:`
            type Query{
                hello:String
                say(name:String):String
            }
        `,
        // functions that will execute
        resolvers:{
            Query:{
                hello:()=>"hello returned",
                say:(_, {name})=> `its ${name}`
            }
        },
    })
    await gqlServer.start();

    app.get("/", (req, res) => {
        res.json({ message: "running" })
    })
   
    app.use('/graphql', expressMiddleware(gqlServer));
    
    app.listen(3000, () => {
        console.log("server started")
    })
}
init();