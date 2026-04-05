import { rotateCamera } from "./rotate.js";

const loadInputElement = document.querySelector("#load-input");
const loadButtonElement = document.querySelector("#load-button");

const xCameraPositionElement = document.querySelector("#x-camera-position");
const yCameraPositionElement = document.querySelector("#y-camera-position");
const zCameraPositionElement = document.querySelector("#z-camera-position");

const xTargetPositionElement = document.querySelector("#x-target-position");
const yTargetPositionElement = document.querySelector("#y-target-position");
const zTargetPositionElement = document.querySelector("#z-target-position");

const rotateInputs = document.querySelectorAll(".rotate-input");

loadButtonElement.addEventListener("click", function () {
  loadModel(loadInputElement.value);
});

document.querySelectorAll(".rotate-button").forEach((btn) => {
  btn.addEventListener("click", function () {
    const input = this.closest("tr").querySelector(".rotate-input");
    rotateCamera(api, input.dataset.axis, input.value);
    clearRotateInputs();
  });
});

document.querySelectorAll(".rotate-input").forEach((input) => {
  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      const btn = input.closest("tr").querySelector(".rotate-button");
      btn.click();
    }
  });
});

document.querySelector("#screenshot-button").addEventListener("click", function () {
  api.getScreenShot("image/jpeg", function (err, data) {
    const link = document.createElement("a");
    link.href = data;
    link.download = `screenshot-${new Date().getTime()}.jpg`;
    link.click();
  });
});

function clearRotateInputs() {
  rotateInputs.forEach((input) => (input.value = ""));
}

function renderCameraPosition(x, y, z) {
  xCameraPositionElement.textContent = x;
  yCameraPositionElement.textContent = y;
  zCameraPositionElement.textContent = z;
}

function renderTargetPosition(x, y, z) {
  xTargetPositionElement.textContent = x;
  yTargetPositionElement.textContent = y;
  zTargetPositionElement.textContent = z;
}

function loadModel(url) {
  const uid = url.match(/^https:\/\/sketchfab.com\/3d-models\/.*-(.+)/)?.at(1);

  client.init(uid, {
    success: function onSuccess(_api) {
      _api.addEventListener("viewerready", function () {
        api = _api;
        _api.getCameraLookAt((err, camera) => {
          renderTargetPosition(...camera.target);
        });
      });
      _api.addEventListener("camerastop", function () {
        _api.getCameraLookAt((err, camera) => {
          renderCameraPosition(...camera.position);
        });
      });
    },
    camera: 0,
    autostart: 1,
  });
}

let api;

const iframe = document.getElementById("viewer");
const client = new Sketchfab("1.12.1", iframe);

const params = new URLSearchParams(location.search);
const model = params.get("model") || "anime-head-pratice-free-download-3fd6a9ccdcaf444aaf01d55b58ea50d8";

loadInputElement.value = "https://sketchfab.com/3d-models/" + model;
loadButtonElement.click();
