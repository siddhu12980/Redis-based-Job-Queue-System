import express, { Request, Response } from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from the server!");
});

app.post("/submit", async (req: Request, res: Response) => {
    try {
        const { problemId, code, language } = req.body;

        await client.lPush("problems", JSON.stringify({ code, language, problemId }));

        res.status(200).send("Submission received and stored for id: " + problemId);
    } catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");
    }
});



app.get("/result/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const data = await client.lRange(`results:${id}`, 0, -1);

        if (!data) {
            res.status(404).send('Result not found for this problemId.');
        }

        res.status(200).json({
            id,
            output: data,
        });
    }
    catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to fetch result.");
    }
});

async function startServer() {
    try {
        await client.connect();
        console.log("Connected to Redis");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startServer();