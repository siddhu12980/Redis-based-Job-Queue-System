import { createClient } from "redis";
import { runJavaScriptCode, runPythonCode } from "./runner";
const client = createClient();

async function processSubmission(submission: string) {
    const { problemId, code, language } = JSON.parse(submission);
    console.log(`Processing submission for problemId ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`Language: ${language}`);

    if (language === "python") {
        try {
            const runOutput = await runPythonCode(code);

            await client.lPush(`results:${problemId}`, runOutput);

            console.log(`Python Output: ${runOutput}`);
        } catch (error) {
            console.error(`Error running Python code: ${error}`);
            await client.lPush(`results:${problemId}`, `Error: ${error}`);


        }
    }
    else if (language === "javascript") {
        try {
            const runOutput = await runJavaScriptCode(code);
            await client.lPush(`results:${problemId}`, runOutput);

            console.log(`JavaScript Output: ${runOutput}`);

        } catch (error) {

            await client.lPush(`results:${problemId}`, `Error: ${error}`);
            console.error(`Error running JavaScript code: ${error}`);

        }
    }


    else {
        console.error(`Unsupported language: ${language}`);
    }


    console.log(`Finished processing submission for problemId ${problemId}.`);
}

async function startWorker() {
    try {
        await client.connect();
        console.log("Worker connected to Redis.");
        while (true) {
            try {
                const submission = await client.brPop("problems", 0);
                console.log("Received submission:", submission);

                if (submission) {
              await processSubmission(submission.element);
                    
                }
            } catch (error) {
                console.error("Error processing submission:", error);
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();