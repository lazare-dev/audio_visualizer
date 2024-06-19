// function interpolateColor(color1, color2, factor) {
//     const hex = (x) => {
//         const result = x.toString(16);
//         return result.length === 1 ? '0' + result : result;
//     };
//     const r = Math.ceil(parseInt(color1.substring(1, 3), 16) * (1 - factor) + parseInt(color2.substring(1, 3), 16) * factor);
//     const g = Math.ceil(parseInt(color1.substring(3, 5), 16) * (1 - factor) + parseInt(color2.substring(3, 5), 16) * factor);
//     const b = Math.ceil(parseInt(color1.substring(5, 7), 16) * (1 - factor) + parseInt(color2.substring(5, 7), 16) * factor);
//     return `#${hex(r)}${hex(g)}${hex(b)}`;
// }

// function getColorPalettes() {
//     return [
//         ['#FF4500', '#FF6347', '#FFFFFF'], // OrangeRed, Tomato, White
//         ['#FFD700', '#FFEB3B', '#FFFFFF'], // Gold, Light Yellow, White
//         ['#32CD32', '#98FB98', '#FFFFFF'], // LimeGreen, PaleGreen, White
//         ['#1E90FF', '#87CEFA', '#FFFFFF'], // DodgerBlue, LightSkyBlue, White
//         ['#9370DB', '#D8BFD8', '#FFFFFF'], // MediumPurple, Thistle, White
//         ['#8B0000', '#FA8072', '#FFFFFF'], // DarkRed, Salmon, White
//     ];
// }

// window.interpolateColor = interpolateColor; // Export to global scope
// window.getColorPalettes = getColorPalettes; // Export to global scope
