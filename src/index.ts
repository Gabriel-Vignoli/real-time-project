import express from "express"
import cors from "cors"
import { routes } from "./routes"
import { connect } from "./database"

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

connect()

app.listen(3000, () => console.log("Application started on http://localhost:3000"))