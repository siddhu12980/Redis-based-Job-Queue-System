import { exec } from 'child_process';
import { VM } from 'vm2';

export const runPythonCode = async (pythonCode: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const command = `python3 -c "${pythonCode.replace(/"/g, '\\"')}"`;
        
        exec(command, (error, stdout, stderr) => {
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
};

export const runJavaScriptCode = async (jsCode: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const command = `node -e "${jsCode.replace(/"/g, '\\"')}"`;
        
        exec(command, (error, stdout, stderr) => {
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
};


