// Animation procédurale : poses exprimées en degrés "vers l'avant" sur les pivots Blender.
// (Blender rot Y négative -> glTF/Three rotation Z positive, d'où rotation.z = angle.)
const D2R = Math.PI / 180;
const JOINTS = ['hipN', 'hipF', 'kneeN', 'kneeF', 'shN', 'shF', 'elN', 'elF', 'torso', 'head'];

export function pose(holder, p, bob = 0) {
  const J = holder.userData.J;
  for (const k of JOINTS) if (J[k]) J[k].rotation.z = (p[k] || 0) * D2R;
  if (J.pelvis) {
    if (J.pelvis.userData.y0 == null) J.pelvis.userData.y0 = J.pelvis.position.y;
    J.pelvis.position.y = J.pelvis.userData.y0 + bob;
  }
}

// cycle de marche générique, phase en radians
export function walkPose(phase, base = {}, amp = 35) {
  const s = Math.sin(phase);
  return {
    ...base,
    hipN: s * amp, hipF: -s * amp,
    kneeN: -Math.max(0, -s) * amp * 1.6 - 6, kneeF: -Math.max(0, s) * amp * 1.6 - 6,
    shN: (base.shN || 0) - s * amp * 0.6, shF: (base.shF || 0) + s * amp * 0.6
  };
}
export const walkBob = phase => Math.abs(Math.cos(phase)) * 0.07;

// teinte d'urgence (télégraphie d'attaque, coup reçu)
export function tint(holder, hex, amount) {
  holder.traverse(m => { if (m.isMesh && m.material.emissive) { m.material.emissive.setHex(hex); m.material.emissiveIntensity = amount; } });
}
