const log = (data) => {
  const tag = document.createElement("p");
  const text = document.createTextNode(data);
  tag.appendChild(text);
  const element = document.getElementById("log");
  element.appendChild(tag);
};

const { ipcRenderer } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.querySelector("input");
  const button = document.querySelector("button");
  const send = () => {
    ipcRenderer.send("text", nameInput.value);
    nameInput.value = "";
  };
  nameInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      send();
    }
  });
  button.addEventListener("click", send);
  ipcRenderer.on("text", (event, message) => {
    log(message);
  });
});
