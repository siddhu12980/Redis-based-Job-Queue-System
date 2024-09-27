const axios = require("axios");

const payload2 = {
  code: "console.log('hello world2')",
  language: "javascript",
};

const payload1 = {
  code: "print('hello world1')",
  language: "python",
};

const submitJob = async (problemId, payload) => {
  let body = {
    problemId,
    ...payload,
  };
  try {
    const response = await axios.post("http://localhost:3000/submit", body);
    console.log(
      `Job with problemId ${problemId} submitted. Response:`,
      response.data
    );
  } catch (error) {
    console.error(
      `Error submitting job with problemId ${problemId}:`,
      error.message
    );
  }
};

const submitMultipleJobs = async (jobCount , payload) => {
  for (let i = 0; i < jobCount; i++) {
    const randomProblemId = Math.floor(Math.random() * 100) + 1; 
    await submitJob(randomProblemId,payload);
  }
};

submitMultipleJobs(5, payload1);
submitMultipleJobs(5, payload2);
