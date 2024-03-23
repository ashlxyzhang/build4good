const { Client } = require("@notionhq/client")
const { config } = require("dotenv")

config()

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