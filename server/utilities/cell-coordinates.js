module.exports = {
  cellId: (x, y) => {
    const rx = 536887296 + x;
    const ry = y * 32768;
    return rx + ry;
  },
  reverseId: cellId => {
    let xcord, ycord;
    let binary = parseInt(cellId, 10).toString(2);

    if (binary.length < 30) binary = "0" + binary;

    xcord = binary.slice(15);
    ycord = binary.slice(0, 15);

    const realx = parseInt(xcord, 2) - 16384;
    const realy = parseInt(ycord, 2) - 16384;

    return [realx, realy];
  }
};
