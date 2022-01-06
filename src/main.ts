import { app, ipcMain, BrowserWindow } from "electron";
import Hyperswarm from "hyperswarm";
import crypto from "crypto";
import path from "path";

console.log("loading...");
const swarm = new Hyperswarm();
const topic = crypto.createHash("sha256").update("fossile-0.0.1").digest();

const boot = async () => {
  await app.whenReady();
  swarm.join(topic);

  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  });
  mainWindow.loadFile(path.join(__dirname, "../index.html"));
  const text = (...texts) => {
    mainWindow.webContents.send("text", texts.join(""));
  };
  text("fossile started...");

  swarm.on("connection", function (sock) {
    ipcMain.on("text", (event, data) => {
      text("me:", data);
      sock.write(data);
    });
    text(`New connection from ${sock.remotePublicKey.toString("hex")}`);

    sock.on("data", function (data) {
      text("Remote peer said:", data.toString());
    });
    sock.on("error", function (err) {
      text("Remote peer errored:", err);
    });
    sock.on("close", function () {
      text("Remote peer fully left");
    });
  });
};
boot();
