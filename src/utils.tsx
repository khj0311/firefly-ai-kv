export const pxToVw = (px: number): number => {
  const vw = (px * 100) / 1920;
  return vw;
};
