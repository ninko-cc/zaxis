export function rotateCamera(api, axis, deg) {
  api.getCameraLookAt(function (err, camera) {
    if (err) return;

    const position = camera.position;
    const target = camera.target;

    const dx = position[0] - target[0];
    const dy = position[1] - target[1];
    const dz = position[2] - target[2];

    const rad = (deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    let newX = dx;
    let newY = dy;
    let newZ = dz;

    if (axis === "y") {
      newX = dx * cos - dy * sin;
      newY = dx * sin + dy * cos;
    } else if (axis === "x") {
      newY = dy * cos - dz * sin;
      newZ = dy * sin + dz * cos;
    } else if (axis === "z") {
      newX = dx * cos - dz * sin;
      newZ = dx * sin + dz * cos;
    }

    const newPosition = [target[0] + newX, target[1] + newY, target[2] + newZ];

    api.setCameraLookAt(newPosition, target, 1.0);

    return newPosition;
  });
}
