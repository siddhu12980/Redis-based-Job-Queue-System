"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const runner_1 = require("./runner");
const client = (0, redis_1.createClient)();
function processSubmission(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        const { problemId, code, language } = JSON.parse(submission);
        console.log(`Processing submission for problemId ${problemId}...`);
        console.log(`Code: ${code}`);
        console.log(`Language: ${language}`);
        if (language === "python") {
            try {
                const runOutput = yield (0, runner_1.runPythonCode)(code);
                yield client.lPush(`results:${problemId}`, runOutput);
                console.log(`Python Output: ${runOutput}`);
            }
            catch (error) {
                console.error(`Error running Python code: ${error}`);
                yield client.lPush(`results:${problemId}`, `Error: ${error}`);
            }
        }
        else if (language === "javascript") {
            try {
                const runOutput = yield (0, runner_1.runJavaScriptCode)(code);
                yield client.lPush(`results:${problemId}`, runOutput);
                console.log(`JavaScript Output: ${runOutput}`);
            }
            catch (error) {
                yield client.lPush(`results:${problemId}`, `Error: ${error}`);
                console.error(`Error running JavaScript code: ${error}`);
            }
        }
        else {
            console.error(`Unsupported language: ${language}`);
        }
        console.log(`Finished processing submission for problemId ${problemId}.`);
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Worker connected to Redis.");
            while (true) {
                try {
                    const submission = yield client.brPop("problems", 0);
                    console.log("Received submission:", submission);
                    if (submission) {
                        yield processSubmission(submission.element);
                    }
                }
                catch (error) {
                    console.error("Error processing submission:", error);
                }
            }
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
startWorker();
