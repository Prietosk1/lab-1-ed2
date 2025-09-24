const tempColors = [
  '#5273FF', // -0.1 a 0.0
  '#b3e0ff', // 0.0 a 0.1
  '#99d0ff', // 0.1 a 0.2
  '#80c1ff', // 0.2 a 0.3
  '#ffeb99', // 0.3 a 0.4
  '#ffcc66', // 0.4 a 0.5
  '#ff9966', // 0.5 a 0.6
  '#ff6666', // 0.6 a 0.7
  '#ff3333', // 0.7 a 0.8
  '#b22222', // 0.8 a 0.9
  '#7f1f1f', // 0.9 a 1.0
];

function getTempColor(temp: number): string {
  // límite inferior
  if (temp < -0.1) return tempColors[0];
  // límite superior
  if (temp > 1) return tempColors[10];

  // calcular índice
  const index = Math.floor((temp + 0.1) / 0.1);
  return tempColors[index];
}

export default getTempColor;
