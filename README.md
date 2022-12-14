# Color Palette Maker.

[Color Palette Maker](https://andersondematos.github.io/ColorPaletteMaker/) is a tool created to help designers, developers, pixel artists and any kind of digital artists to create color palettes and dowload them in PNG or JSON file.


## How it works.

Choose a "left color" and a "right color", the amount of colors you want in the color swatch and the application will create the intermediary colors between both colors taking in account the hue, saturation, lightness and alpha values. Colors can be added individually too if the number of colors in the swatch color is 1, in this case, only the 'left color' color will be considered and the 'right color' will be disabled. 

The position of the handle of the "right color" slider matters.
A swatch of 5 colors going from a dark blue (H: 240, S: 100, L: 13, A: 100) to a light yellow (H:60, S: 93, L: 70, A: 100), with the handle of the 'right color' to the left from the center of the slider:
<a href="https://imgur.com/E2qRcQx"><img src="https://i.imgur.com/E2qRcQx.png" title="source: imgur.com" /></a>


And here the same same two main colors, but with the handle on the opposite side from the center the slider:
<a href="https://imgur.com/Ktvk2g2"><img src="https://i.imgur.com/Ktvk2g2.png" title="source: imgur.com" /></a>


Once you are satified with the colors generated, click the "Add to palette" button to add them to the color palette. By default, the colors that are repeated in the color watch or in the color palette will not be added the the color palette.
You can add, select, move and delete colors to organize the color palette.
<a href="https://imgur.com/dGgy8Op"><img src="https://i.imgur.com/dGgy8Op.png" title="source: imgur.com" /></a>


Click the download icon button at the top right of the page to open a popup where you can see a preview of the PNG file and the buttons to download the palette in PNG o JSON format.  
<a href="https://imgur.com/E9JMdGH"><img src="https://i.imgur.com/E9JMdGH.png" title="source: imgur.com" /></a>


Even though this is not the best use case for Color Palette Maker, it is possible to use it to create small pixel arts (limited to 32x32 pixel in scale 1:1, or any resolution limited to 32 pixel in width, where width * height is less than or equal to 1024 pixels).
To create this pixel art, was first created color swatch of 4 colors (game boy style), adding them to the color palette, and with the 'Add repeated' enabled more reapeated colors were added untill it reached the limit of 1024. Then, with 'Edit selectd' enabled, the color slots were recolored by selecting colors slots and clicking on a color in the color palette holding Ctrl + Alt to make the selected colors to be recolored to the clicked color.
There are 'undo' and 'Redo' options, but there is no way to save and load the 'pixel art projetc', only download the PNG or JSON file.
<a href="https://imgur.com/WV997IC"><img src="https://i.imgur.com/WV997IC.png" title="source: imgur.com" /></a>


## The JSON file.

This is how a 'pretty print' of a JSON file with only two colors downloaded from Color Palette Maker will look.
You can access the color values first by their index and then by the key / value pairs. 
```
[
  [
    {
      "RGBA": {
        "r": 162,
        "g": 179,
        "b": 50,
        "a": 255
      }
    },
    {
      "HSLA": {
        "h": 68,
        "s": 56,
        "l": 45,
        "a": 100
      }
    },
    {
      "HEX": "a2b332ff"
    }
  ],
  [
    {
      "RGBA": {
        "r": 18,
        "g": 51,
        "b": 84,
        "a": 255
      }
    },
    {
      "HSLA": {
        "h": 210,
        "s": 65,
        "l": 20,
        "a": 100
      }
    },
    {
      "HEX": "123354ff"
    }
  ]
]
```

## Todo.

* Make the application responsive to work better when visualized in mobile divices.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
