export const random = (m, n) => Math.round(Math.random() * (n - m) + m);

export const randomColor = () =>
  +(
    '0x' +
    Math.random()
      .toString(16)
      .slice(2, 8)
  );
