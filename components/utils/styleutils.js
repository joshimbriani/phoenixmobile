export function getComplementaryColor(color) {
    var c = color.slice(1),
        i = parseInt(c, 16),
        v = ((1 << 4 * c.length) - 1 - i).toString(16);

    while (v.length < c.length) {
        v = '0' + v;
    }
    return '#' + v;
}
