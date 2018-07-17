export function getComplementaryColor(color) {
    var c = color.slice(1),
        i = parseInt(c, 16),
        v = ((1 << 4 * c.length) - 1 - i).toString(16);

    while (v.length < c.length) {
        v = '0' + v;
    }
    return '#' + v;
}

export function getMaterialColor() {
    const materialColors = [
        '#1abc9c',
        '#2ecc71',
        '#3498db',
        '#9b59b6',
        '#34495e',
        '#16a085',
        '#27ae60',
        '#2980b9',
        '#8e44ad',
        '#2c3e50',
        '#f1c40f',
        '#e67e22',
        '#e74c3c',
        '#f39c12',
        '#d35400',
        '#c0392b'
    ]

    return materialColors[Math.floor(Math.random() * materialColors.length)];
}

export const getMaterialColorLength = 16;

export const materialColors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#f39c12', '#d35400', '#c0392b' ];