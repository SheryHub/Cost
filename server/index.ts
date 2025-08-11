import express, { type Request, Response, NextFunction } from "express";
import { spawn } from "child_process";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Start Python FastAPI server as a child process
let pythonServer: any = null;

const startPythonServer = () => {
  const pythonPath = '/home/runner/workspace/.pythonlibs/bin/python';
  
  pythonServer = spawn(pythonPath, ['server/main.py'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    cwd: '/home/runner/workspace',
    env: { ...process.env, PORT: '6000' }
  });

  pythonServer.stdout?.on('data', (data: Buffer) => {
    console.log(`[python] ${data.toString().trim()}`);
  });

  pythonServer.stderr?.on('data', (data: Buffer) => {
    console.log(`[python] ${data.toString().trim()}`);
  });

  pythonServer.on('close', (code: number) => {
    console.log(`[python] Process exited with code ${code}`);
  });

  pythonServer.on('error', (err: Error) => {
    console.error('[python] Failed to start:', err);
  });
};

// Proxy API requests to Python server
app.use('/api', async (req: Request, res: Response) => {
  try {
    const { default: fetch } = await import('node-fetch');
    const url = `http://localhost:6000${req.path}`;
    
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('[proxy] Error:', error);
    res.status(500).json({ error: 'Backend service unavailable', message: 'Python FastAPI server not responding' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', backend: 'python-fastapi' });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Start Python backend
  startPythonServer();
  
  // Wait a moment for Python server to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  const server = app.listen(0); // Let system assign port temporarily

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup vite for development
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Close temporary server and start on correct port
  server.close();

  const port = parseInt(process.env.PORT || '5000', 10);
  const finalServer = app.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
    log(`python backend on port 6000`);
  });

  // Cleanup on exit
  process.on('SIGTERM', () => {
    if (pythonServer) {
      pythonServer.kill('SIGTERM');
    }
    finalServer.close();
  });

  process.on('SIGINT', () => {
    if (pythonServer) {
      pythonServer.kill('SIGINT');
    }
    finalServer.close();
  });
})();
