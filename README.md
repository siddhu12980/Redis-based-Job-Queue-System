# Redis-based Job Queue System

## Overview

This project implements a simple job queue system using Redis, Express.js, and Node.js. It consists of a master component that receives and enqueues jobs, and a worker component that processes these jobs. The system is designed to handle code execution tasks in Python and JavaScript.

## Components

### 1. Master (Job Enqueuer)

The master component is an Express.js server that:
- Listens for job submissions via a POST request to `/submit`
- Enqueues jobs into a Redis list named "problems"

### 2. Worker (Job Processor)

The worker component:
- Continuously polls the Redis queue for new jobs
- Dequeues and processes jobs, executing the submitted code based on the specified language

## Prerequisites

- Node.js (v14+ recommended)
- npm (comes with Node.js)
- Redis server

## Setup

1. Clone the repository:
   ```
   git clone <repo>
   cd <repo>
   ```

2. Install dependencies:
   ```
   npm i /redisMaster
   npm i /redisWorker
   ```

3. Ensure Redis is installed and running on your system.

4. Configure Redis connection (if needed):
   - Open `master.js` and `worker.js`
   - Modify the Redis client creation if your Redis server isn't running on default localhost:6379

## Running the System

1. Start the master component:
   ```
   cd redisMaster
   tsc -b 
   node dist/index.js
   ```
   The server will start on port 3000.

2. Start one or more worker instances:
   ```
   cd redisWorker
   tsc -b 
   node dist/index.js
   ```

## Usage


### Submitting a Job

Send a POST request to `http://localhost:3000/submit` with a JSON body:

```json
{
"problemId": "unique_problem_id",
"code": "print('Hello, World!')",
"language": "python"
}
```



### Getting Output
```bash
http://localhost:3000/result/:id
```


## Code Compilation and Execution

### Python Execution: 
The worker processes Python code using a separate child process. The submitted code is executed, and the output or error messages are stored in the Redis results list associated with the problem ID.

### JavaScript Execution:
 Similarly, JavaScript code is executed in a child process. The output or errors are captured and stored in Redis, allowing users to retrieve the results using the /result/:id endpoint.



You can use curl, Postman, or any HTTP client to submit jobs.





## Architecture

```
+-------------+     +-------------+     +--------------+
|   Client    |---->|    Master   |---->|  Redis Queue |
+-------------+     +-------------+     +--------------+
                                               ^
                                               |
                                               |
                                        +-------------+
                                        |   Worker    |
                                        +-------------+
```

1. Clients submit jobs to the Master.
2. Master enqueues jobs into the Redis Queue.
3. Workers continuously poll the Redis Queue for new jobs.
4. When a job is available, a Worker dequeues and processes it.


## Limitations and Future Improvements

- Currently supports only Python and JavaScript. Extend `runner.js` to support more languages.
- Add result storage mechanism to persist job outputs.
- Implement job prioritization and scheduling features.
- Add proper logging and monitoring for production use.
- Implement security measures for code execution.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).