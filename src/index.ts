import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { prismaClient } from './lib/db';


async function init() {
    const app = express();
    app.use(express.json());
    // creating gql server 
    const gqlServer = new ApolloServer({
        // schemas
        typeDefs: `
            type Query{
                hello:String
                say(name:String):String
            }
            type Mutation{
                createUser(firstName:String!, lastName:String!,email:String!, password: String!):Boolean
            }
        `,
        // functions that will execute
        resolvers: {
            Query: {
                hello: () => "hello returned",
                say: (_, { name }) => `its ${name}`
            },
            Mutation: {
                createUser: async (_,
                    { firstName, lastName, email, password }:
                        { firstName: string, lastName: string, email: string, password: string }
                ) => {
                    await prismaClient.user.create({
                        data: {
                            firstName, lastName, email, password, salt: "fdsd",
                        },
                    })
                }
            }
        }
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