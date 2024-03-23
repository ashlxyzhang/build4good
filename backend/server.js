import { Client } from "@notionhq/client"
import { config } from "dotenv"
import express from "express";
import cors from "cors";

config()
const app = express()
app.use(cors())

const dbId = process.env.NOTION_DB_ID
const apiKey = process.env.NOTION_API_KEY

const notion = new Client({ auth: apiKey })

const query_db = async () => {
    const all_vinyls = await notion.databases.query({
        database_id: dbId,
        filter: {
            property: "id",
            "number": {
                "less_than": 5
            }
        },
        sorts: [{
            property: "id",
            direction: "ascending",
        }]
    })
    return all_vinyls.results;
}

app.get("/vinyls", async (req, res) => {
    try {
        const result = await query_db();
        res.json(result)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});