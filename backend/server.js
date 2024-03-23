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
                "less_than": 100
            }
        },
        sorts: [{
            property: "id",
            direction: "ascending",
        }]
    })
    return all_vinyls.results;
}

const search_db = async (prop="") => {
    const searched_vinyls = await notion.databases.query({
        database_id: dbId,
        filter: {
            "or": [
                {
                    "property": "album",
                    "rich_text": {
                        "contains": prop,
                    }
                },
                {
                    "property": "ars_name",
                    "rich_text": {
                        "contains": prop,
                    }
                }
            ]
        },
        sorts: [{
            property: "id",
            direction: "ascending",
        }]
    })
    console.log(searched_vinyls.results)
    return searched_vinyls.results;
}

app.get("/vinyls", async (req, res) => {
    try {
        const result = await query_db();
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get("/search_vinyls", async (req, res) => {
    console.log(req);
    try {
        const result = await search_db(req.query.prop);
        res.json(result);
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});