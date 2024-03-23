const { Client } = require("@notionhq/client")
const { config } = require("dotenv")

config()

const dbId = process.env.NOTION_DB_ID
const apiKey = process.env.NOTION_API_KEY

const notion = new Client({ auth: apiKey })

const query_db = async () => {
    const all_vinyls = await notion.databases.query({
        database_id: dbId,
        page_size: 5,
        filter: {
            property: "id",
            "number": {
                "less_than": 100
            }
        },
        sort: {
            property: "id",
            direction: "ascending",
        }
    })
    console.log(all_vinyls.results)
}

query_db()