// server/controllers/systemController.js
import os from "os";
import fs from "fs";
import { execSync } from "child_process";

// Detects whether this process is running inside a Docker container.
// The /.dockerenv file is created by Docker itself at container start —
// this is the standard, reliable way to check.
function isRunningInDocker() {
  try {
    return fs.existsSync("/.dockerenv");
  } catch {
    return false;
  }
}

function safeExec(cmd) {
  try {
    return execSync(cmd, { timeout: 2000 }).toString().trim();
  } catch {
    return null;
  }
}

function getCpuLoadPercent() {
  // os.loadavg() is Linux/macOS only and returns 0s on Windows — expected,
  // since this endpoint is designed to run on the actual Linux deployment
  // (Render), not a local Windows dev machine.
  const [load1] = os.loadavg();
  const cores = os.cpus().length || 1;
  const percent = (load1 / cores) * 100;
  return Math.min(100, Math.round(percent * 10) / 10);
}

function getMemoryStats() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return {
    totalMB: Math.round(total / 1024 / 1024),
    usedMB: Math.round(used / 1024 / 1024),
    freeMB: Math.round(free / 1024 / 1024),
    usedPercent: Math.round((used / total) * 1000) / 10,
  };
}

export const getSystemSnapshot = (req, res) => {
  const inDocker = isRunningInDocker();

  const snapshot = {
    timestamp: new Date().toISOString(),
    host: {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      uptimeSeconds: Math.round(os.uptime()),
      processUptimeSeconds: Math.round(process.uptime()),
    },
    cpu: {
      cores: os.cpus().length,
      model: os.cpus()[0]?.model ?? "unknown",
      loadPercent: getCpuLoadPercent(),
    },
    memory: getMemoryStats(),
    docker: {
      runningInContainer: inDocker,
      // Only attempt docker CLI calls if NOT already inside a container —
      // a container usually can't see the host's other containers unless
      // the docker socket is explicitly mounted.
      version: !inDocker ? safeExec("docker --version") : null,
    },
    git: {
      commit: safeExec("git rev-parse --short HEAD"),
      branch: safeExec("git rev-parse --abbrev-ref HEAD"),
    },
  };

  res.status(200).json({ success: true, data: snapshot });
};
