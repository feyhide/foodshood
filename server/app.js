const fastify = require("fastify")

const start = async() => {
    const app = fastify()
    const PORT = process.env.PORT||3000
    app.listen({port:PORT,host: "0.0.0.0"},
        (err,addr) => {
            if(err){
                console.log(err)
            }else{
                console.log(`FoodShood running on http://localhost:${PORT}`)
            }
        }
    )
}

start()