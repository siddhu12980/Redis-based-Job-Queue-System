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
exports.runJavaScriptCode = exports.runPythonCode = void 0;
const child_process_1 = require("child_process");
const runPythonCode = (pythonCode) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const command = `python3 -c "${pythonCode.replace(/"/g, '\\"')}"`;
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python code: ${error.message}`);
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Python stderr: ${stderr}`);
                reject(`Error: ${stderr}`);
                return;
            }
            console.log(`Python Output: ${stdout}`);
            resolve(stdout);
        });
    });
});
exports.runPythonCode = runPythonCode;
const runJavaScriptCode = (jsCode) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const command = `node -e "${jsCode.replace(/"/g, '\\"')}"`;
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing JavaScript code: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`JavaScript stderr: ${stderr}`);
                return;
            }
            resolve(stdout.trim());
        });
    });
});
exports.runJavaScriptCode = runJavaScriptCode;
