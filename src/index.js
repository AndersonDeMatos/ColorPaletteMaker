import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactSlider from 'react-slider';
import './index.css';
import reportWebVitals from './scripts/reportWebVitals';


const MAX_SLOTS = 1024;
const MAX_ACTIONS = 50;
let image = new Image();
let canvasSize = {w: 0, h: 0};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      miniPaletteColors: [
        'hsla(0,100%,50%,1)',
        'hsla(0,100%,50%,1)',
      ],
      actionsDone: [],
      actionsReverted: [],
      lastUndoPossible: [],
      allowRepeated: false,
      columnCount: 6,
      paletteColors: [],
      colorValuesJSON: [],
      selecting: false,
      hasSelected: false,
      changingSelected: false,
      beingChanged: {id: 'leftHueSlider', value: '0'},
      editSelectedChecked: false,
      firstSelected: 0,
      lastSelected: 0,
      leftHex: '#FF000000',
      rightHex: '#FF000000',
      previewResolution: '(pixels)',
      buttonsVisibility: 'visible',
      warningVisible: 'collapse',
      valuesDisabled: '',
    };
    this.recordAction = this.recordAction.bind(this);
    this.onUndoButtonClicked = this.onUndoButtonClicked.bind(this);
    this.onRedoButtonClicked = this.onRedoButtonClicked.bind(this);
    this.onExportButtonClicked = this.onExportButtonClicked.bind(this);
    this.onAllowRepeatedClicked = this.onAllowRepeatedClicked.bind(this);
    this.onAddToPaletteClicked = this.onAddToPaletteClicked.bind(this);
    this.getCSSvalue = this.getCSSvalue.bind(this);
    this.calculateRightHue = this.calculateRightHue.bind(this);
    this.onWarningClicked = this.onWarningClicked.bind(this);
    this.onSliderInput = this.onSliderInput.bind(this);
    this.onSpinBoxInput = this.onSpinBoxInput.bind(this);
    this.onHEXtextInput = this.onHEXtextInput.bind(this);
    this.HEXfromCSSvalues = this.HEXfromCSSvalues.bind(this);
    this.onColorCountChanged = this.onColorCountChanged.bind(this);
    this.onColumnCountChanged = this.onColumnCountChanged.bind(this);
    this.onChangeSelectedClicked = this.onChangeSelectedClicked.bind(this);
    this.changeSelectedColors = this.changeSelectedColors.bind(this);
    this.setMiniPaletteColors = this.setMiniPaletteColors.bind(this);
    this.setMiniPaletteColors = this.setMiniPaletteColors.bind(this);
    this.onSampleButtonMouseOver = this.onSampleButtonMouseOver.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onCancelClicked = this.onCancelClicked.bind(this);
    this.onPreviewSizeChanged = this.onPreviewSizeChanged.bind(this);
    this.onDownloadJSONButtonClicked = this.onDownloadJSONButtonClicked.bind(this);
    this.onDownloadPNGButtonClicked = this.onDownloadPNGButtonClicked.bind(this);
  };

  componentDidMount() {
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("mousedown", this.onMouseDown);
  };

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("mousedown", this.onMouseDown);
  };

  recordAction(newColors, newMessage) {
    let actions = this.state.actionsDone.slice();
    let newAction = {colors: newColors, message: newMessage};
    actions.push(newAction);
    if (actions.length > MAX_ACTIONS) {
      this.setState({
        lastUndoPossible: actions[actions.length - MAX_ACTIONS - 1].colors,
      });
      actions.shift();
    }
    this.setState({
      actionsDone: actions,
      actionsReverted: [],
      paletteColors: newColors,
    });
  }

  onUndoButtonClicked() {
    let actions = this.state.actionsDone.slice();
    let last = actions.pop();
    let colors = actions.length > 0 ? actions[actions.length - 1].colors : this.state.lastUndoPossible;
    let reverted = this.state.actionsReverted.slice();
    reverted.push(last);
    this.setState({
      actionsDone: actions,
      actionsReverted: reverted,
      paletteColors: colors,
      hasSelected: false,
      warningVisible: 'collapse',
    });
  }

  onRedoButtonClicked() {
    let reverted = this.state.actionsReverted.slice();
    let colors = reverted.length > 0 ? reverted[reverted.length - 1].colors : [];
    let last = reverted.pop();
    let actions = this.state.actionsDone.slice();
    actions.push(last);
    this.setState({
      actionsReverted: reverted,
      actionsDone: actions,
      paletteColors: colors,
    });
  }

  onExportButtonClicked() {
    imageFromPalette(this.state.columnCount, this.state.paletteColors);
    document.getElementById('inputBlocker').style.visibility = 'Visible';
    document.getElementById('previewSize').value = '100%';
    let palette = [];
    this.state.paletteColors.forEach((color) => {
      let newColor = [];
      if (color.startsWith('r')) {
        const values = color.replace('rgba(', '').replace(')', '').split(',');
        const RGBA = {RGBA: {r: parseInt(values[0]), g: parseInt(values[1]), b: parseInt(values[2]), a: Math.round(parseFloat(values[3]) * 255)}};
        const HSLA = (
          'rgba(0,0,0,1)' ? {HSLA: {h: 0.0, s: 0.0, l: 0.0, a: 100.0}} :
          'rgba(255,255,255,1)' ? {HSLA: {h: 0.0, s: 0.0, l: 100.0, a: 100.0}} :
          {HSLA: {h: 0.0, s: 0.0, l: 0.0, a: 0.0}}
        );
        const HEX = {
          HEX:
          RGBA.RGBA.r.toString(16).padStart(2, "0")+
          RGBA.RGBA.g.toString(16).padStart(2, "0")+
          RGBA.RGBA.b.toString(16).padStart(2, "0")+
          RGBA.RGBA.a.toString(16).padStart(2, "0")
        };
        newColor.push(RGBA)
        newColor.push(HSLA)
        newColor.push(HEX);
        palette.push(newColor);
      } else {
        const values = color.replace('hsla(', '').replace(')', '').split(',');
        const rgb = HSLtoRGB(parseInt(values[0]), parseInt(values[1]), parseInt(values[2]));
        const RGBA = {RGBA: {r: rgb[0], g: rgb[1], b: rgb[2], a: Math.round(parseFloat(values[3]) * 255)}};
        const HSLA = {HSLA: {h: parseInt(values[0]), s: parseInt(values[1]), l: parseInt(values[2]), a: Math.round(parseFloat(values[3] * 100))}};
        const HEX = {
          HEX:
          RGBA.RGBA.r.toString(16).padStart(2, "0")+
          RGBA.RGBA.g.toString(16).padStart(2, "0")+
          RGBA.RGBA.b.toString(16).padStart(2, "0")+
          RGBA.RGBA.a.toString(16).padStart(2, "0")
        };
        newColor.push(RGBA)
        newColor.push(HSLA)
        newColor.push(HEX);
        palette.push(newColor);
      }
    })
    this.setState({
      previewResolution: `${canvasSize.w}x${canvasSize.h} (pixels)`,
      colorValuesJSON: palette,
    });
  };

  onAllowRepeatedClicked(e) {
    this.setState({
      allowRepeated: e.target.checked,
    });
  }

  onAddToPaletteClicked(e) {
    let colors = this.state.paletteColors.slice();
    let colorAmount = 0;
    this.state.miniPaletteColors.forEach( (color) => {
      const values = color.replace('hsla(', '').replaceAll('%', '').replace(')', '').split(',');
      const checkedColor = (clr) => {
        return (
        (clr[3] === '0') ? 'rgba(0,0,0,0)' :
        (clr[2] === '0' && clr[3] === '1') ? 'rgba(0,0,0,1)' :
        (clr[2] === '100' && clr[3] === '1') ? 'rgba(255,255,255,1)' :
        color
        );
      };
      if (parseInt(colors.length) < MAX_SLOTS) {
        if (this.state.allowRepeated) {
          colors.push(checkedColor(values));
          colorAmount++;
        } else if (!colors.includes(color) && !colors.includes(checkedColor(values))) {
          colors.push(checkedColor(values));
          colorAmount++;
        }
      }
    });
    if (colorAmount > 0) {
      const message = `adding ${colorAmount} colors.`;
      this.recordAction(colors, message);
    }
  };

  onPreviewSizeChanged(e) {
    let multiplier = parseInt(e.target.value.replace('00%', ''));
    let ctx = document.getElementById('previewCanvas').getContext('2d');
    ctx.canvas.width = canvasSize.w * multiplier;
    ctx.canvas.height = canvasSize.h * multiplier;
    image.width = ctx.canvas.width;
    image.height = ctx.canvas.height;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.scale(multiplier, multiplier);
    this.setState({
      previewResolution: `${ctx.canvas.width}x${ctx.canvas.height} (pixels)`
    });
  }

  onDownloadPNGButtonClicked() {
    let tempLink = document.createElement( 'a' );
    let img = document.getElementById('previewCanvas').toDataURL();
    tempLink.download = 'color_palette.png';
    tempLink.href = img;
    document.body.appendChild( tempLink );
    tempLink.click();
    document.body.removeChild( tempLink );
  }

  onDownloadJSONButtonClicked() {
    let tempLink = document.createElement( 'a' );
    let jsonString = JSON.stringify(this.state.colorValuesJSON);
    let jsonFile = 'data:application/json;charset=utf-8,'+ encodeURIComponent(jsonString);
    tempLink.download = 'color_palette.json';
    tempLink.href = jsonFile;
    document.body.appendChild( tempLink );
    tempLink.click();
    document.body.removeChild( tempLink );
  }

  onCancelClicked() {
    document.getElementById('inputBlocker').style.visibility = 'Hidden';
  }

  getCSSvalue(cssVar) {
    return getComputedStyle(document.documentElement).getPropertyValue(cssVar);
  };

  calculateRightHue() {
    const leftHue = parseInt(this.getCSSvalue('--leftHue'));
    const rightHue = parseInt(this.getCSSvalue('--rightHue'));
    const absRightHue = () => { return rightHue < 0 ? rightHue + 360 : rightHue; }
    return wrap(leftHue + absRightHue(), 0, 360);
  };

  onWarningClicked() {
    this.setState({
      hasSelected: false,
      warningVisible: 'collapse',
    });
  }

  onSliderInput(e) {
    const currentId = e.target.id.replace('Slider', '');
    const cssVal = () => {
      return e.target.max === '100' ? `${e.target.value}%` : e.target.value
    };
    document.documentElement.style.setProperty('--'+currentId, cssVal());
    const colors = this.state.miniPaletteColors.slice();
    const newColors = this.setMiniPaletteColors(colors);
    const leftHexCode = this.HEXfromCSSvalues('left');
    const rightHecCode = this.HEXfromCSSvalues('right');
    this.setState({
      miniPaletteColors: newColors,
      leftHex: leftHexCode,
      rightHex: rightHecCode,
    });
  };

  onSpinBoxInput(e) {
    const currentId = e.target.id.replace('SpinBox', '');
    let value = (e.target.value === '') ? 0 : e.target.value;
    value = e.target.max === '100' ? clamp(parseInt(value), 0, 100) : wrap(parseInt(value), 0, 360);
    const cssVal = (
      currentId.endsWith('Alpha') ? value / 100 :
      e.target.max === '100' ? `${value}%` :
      currentId !== 'rightHue' ? value :
      parseInt(this.getCSSvalue('--rightHue')) < 0 ? wrap(value - 360 - parseInt(this.getCSSvalue('--leftHue')), -360, 0) :
      wrap(parseInt(value) - parseInt(this.getCSSvalue('--leftHue')), 0, 360)
    );
    document.documentElement.style.setProperty('--'+currentId, cssVal);
    const colors = this.state.miniPaletteColors.slice();
    const newColors = this.setMiniPaletteColors(colors);
    const leftHexCode = this.HEXfromCSSvalues('left');
    const rightHecCode = this.HEXfromCSSvalues('right');
    this.setState({
      miniPaletteColors: newColors,
      leftHex: leftHexCode,
      rightHex: rightHecCode,
    });
  };

  changeSelectedColors() {
    let colors = this.state.paletteColors.slice();
    let index = Math.min(this.state.firstSelected, this.state.lastSelected);
    const last = Math.max(this.state.firstSelected, this.state.lastSelected);
    for (index; index <= last; index++) {
      colors[index] = `hsla(${this.getCSSvalue('--leftHue')},${this.getCSSvalue('--leftSaturation')},${this.getCSSvalue('--leftLightness')},${this.getCSSvalue('--leftAlpha')})`;
    }
    return colors;
  }

  onHEXtextInput(e) {
    const value = e.target.value.replace('#', '');
    const currentId = e.target.id.replace('Value', '');
    const REGEX = /[a-fA-F0-9]/;
    let hexCode = '#';
    for (let i = 0; i < value.length; i++) {
      if (REGEX.test(value[i])) {
        hexCode += value[i];
      }
    }
    const fullHexCode = (
      value.length === 3 ? value[0] + value[0] + value[1] + value[1] + value[2] + value[2] + 'FF' :
      value.length === 4 ? value[0] + value[0] + value[1] + value[1] + value[2] + value[2] + value[3] + value[3] :
      value.length === 6 ? value + 'FF':
      value.length === 8 ? value :
      '000000FF'
    );
    const hsl = RGBtoHSL(
      parseInt(fullHexCode.slice(0, 2), 16),
      parseInt(fullHexCode.slice(2, 4), 16),
      parseInt(fullHexCode.slice(4, 6), 16)
    );
    const side = e.target.id.replace('HexValue', '');
    if (fullHexCode.length > 1) {
      const obj = (i) => {
        const id = (
          i === 0 ? side+'HueSpinBox' :
          i === 1 ? side+'SaturationSpinBox' :
          i === 2 ? side+'LightnessSpinBox' :
          side+'AlphaSpinBox'
        );
        const max = (i !== 0) ? '100' : '';
        const val = (
          i === 0 ? Math.round(hsl[0]) :
          i === 1 ? Math.round(hsl[1]) :
          i === 2 ? Math.round(hsl[2]) :
          Math.round((parseInt(fullHexCode.slice(6), 16) / 255) * 100)
        );
        return {target: {id: id, max:max, value: val}}
      };
      this.onSpinBoxInput(obj(0));
      this.onSpinBoxInput(obj(1));
      this.onSpinBoxInput(obj(2));
      this.onSpinBoxInput(obj(3));
    }
    this.setState({
      [currentId]: hexCode.toUpperCase(),
    });
  }

  HEXfromCSSvalues(side) {
    const H = (
      side === 'left' ? parseInt(this.getCSSvalue('--leftHue')) :
      wrap(parseInt(this.getCSSvalue('--leftHue')) + parseInt(this.getCSSvalue('--rightHue')), 0, 360)
    );
    const S = parseInt(this.getCSSvalue('--' + side + 'Saturation'));
    const L = parseInt(this.getCSSvalue('--' + side + 'Lightness'));
    const A = Math.round(this.getCSSvalue('--' + side + 'Alpha') * 255);
    const RGB = HSLtoRGB(H, S, L);
    const hexCode = (
      '#' +
      RGB[0].toString(16).padStart(2, "0") +
      RGB[1].toString(16).padStart(2, "0") +
      RGB[2].toString(16).padStart(2, "0") +
      A.toString(16).padStart(2, "0")
    );
    return hexCode.toUpperCase()
  }

  onColorCountChanged(e) {
    let colors = [];
    while (colors.length < clamp(parseInt(e.target.value), parseInt(e.target.min), parseInt(e.target.max))) {
      colors.push('');
    }
    const newColors = this.setMiniPaletteColors(colors);
    this.setState({
      miniPaletteColors: newColors,
      valuesDisabled: (e.target.value === "" || e.target.value === "1") ? 'disabled' : '',
    });
  };
  

  onColumnCountChanged(e) {
    let clampedCount = e.target.value === '' ? 1 : clamp(parseInt(e.target.value), parseInt(e.target.min), parseInt(e.target.max));
    document.documentElement.style.setProperty('--columnCount', clampedCount);
    this.setState({
      columnCount: clampedCount,
    });
  };

  onChangeSelectedClicked(e) {
    const isSelected = e.target.checked && this.state.hasSelected;
    this.setState({
      editSelectedChecked: e.target.checked,
      hasSelected: isSelected,
      warningVisible: isSelected ? 'visible' : 'collapse',
    })
  }

  onMouseDown(e) {
    if (e.target.id.startsWith('paletteColor')) {
      const index = e.target.id.replace('paletteColor', '')
      const color =  this.state.paletteColors[index];
      const values = (clr) => {
        return (
        clr === 'rgba(0,0,0,1)' ? ['0','0','0','1'] :
        clr === 'rgba(255,255,255,1)' ? ['0','0','100','1'] :
        clr === 'rgba(0,0,0,0)' ? ['0','0','0','0'] :
        clr.replace('hsla(', '').replaceAll('%', '').replace(')', '').split(',')
        )
      };
      if (window.event.ctrlKey && window.event.altKey) {
        const side = (window.event.which === 1) ? 'left' : 'right';
        if (window.event.which === 1 || window.event.which === 3) {
          const obj = (i) => {
            const id = (
              i === 0 ? side+'HueSpinBox' :
              i === 1 ? side+'SaturationSpinBox' :
              i === 2 ? side+'LightnessSpinBox' :
              side+'AlphaSpinBox'
            );
            const max = (i !== 0) ? '100' : '';
            const val = i < 3 ? values(color)[i] : Math.round(parseFloat(values(color)[i]) * 100);
            return {target: {id: id, max:max, value: val}}
          };
          this.onSpinBoxInput(obj(0));
          this.onSpinBoxInput(obj(1));
          this.onSpinBoxInput(obj(2));
          this.onSpinBoxInput(obj(3));
          if (this.state.editSelectedChecked && this.state.hasSelected && window.event.which === 1) {
            const newColors = this.changeSelectedColors();
            const amount = Math.abs(this.state.firstSelected - this.state.lastSelected) + 1;
            const newMessage = 'changing ' + amount + ' colors.';
            this.recordAction(newColors, newMessage);
          }
        }
      } else if (window.event.which === 1) {
        const buttonIndex = parseInt(e.target.id.replace('paletteColor', ''));
        this.setState({
          selecting: true,
          hasSelected: true,
          firstSelected: buttonIndex,
          lastSelected: buttonIndex,
          warningVisible: this.state.editSelectedChecked ? 'visible' : 'collapse',
        });
      }
    } else if (
      e.target.id.startsWith('left')
      && (e.target.id.endsWith('Slider') || e.target.id.endsWith('SpinBox'))
      && this.state.hasSelected
      && this.state.editSelectedChecked) {
      this.setState({
        changingSelected: true,
        beingChanged: {id: e.target.id, value: e.target.value},
      });
    } else if (this.state.warningVisible === 'collapse') {
      this.setState({
        hasSelected: false
      });
    }
  };

  onSampleButtonMouseOver(e) {
    const buttonIndex = parseInt(e.target.id.replace('paletteColor', ''));
    if (this.state.selecting) {
      this.setState({
        lastSelected : buttonIndex
      });
    }
  };

  onMouseUp(e) {
    if (this.state.changingSelected) {
      this.setState({
        changingSelected: false,
        selecting: false,
      });
      const newColors = this.changeSelectedColors();
      const amount = Math.abs(this.state.firstSelected - this.state.lastSelected) + 1;
      const newMessage = 'changing ' + amount + ' colors.';
      this.recordAction(newColors, newMessage);
      return;
    }
    this.setState({
      selecting: false,
    });
  };

  onKeyDown() {
    let cursorType = (window.event.ctrlKey && window.event.altKey) ? 'pointer' : 'default';
    document.documentElement.style.setProperty('--conditionalCursor', cursorType);
    if (this.state.actionsReverted.length !== 0 && window.event.which === 90 && window.event.ctrlKey && window.event.altKey) {
      this.onRedoButtonClicked();
    } else if (this.state.actionsDone.length !== 0 && window.event.which === 90 && window.event.ctrlKey) {
      this.onUndoButtonClicked();
    }
    if (this.state.hasSelected) {
      const first = Math.min(this.state.firstSelected, this.state.lastSelected);
      const last = Math.max(this.state.firstSelected, this.state.lastSelected);
      const beforeSelected = this.state.paletteColors.slice(0, first);
      const selected = this.state.paletteColors.slice(first, last + 1);
      const amount = selected.length;
      const newMessage = 'moving ' + amount + ' colors.';
      const afterSelected = this.state.paletteColors.slice(last + 1);
      const columns = parseInt(this.state.columnCount);
      const paletteLength = this.state.paletteColors.length;
      const currentId = document.activeElement.id;
      const setMoved = (newArr, newFirst, newLast) => {
        this.setState({
          paletteColors: newArr,
          firstSelected: newFirst,
          lastSelected: newLast,
        });
      };
      switch (window.event.which) {
        case 13: // Enter Key
          if (currentId.startsWith('left')) {
            const newColors = this.changeSelectedColors();
            this.recordAction(newColors, newMessage);
          }
          break;
        case 16: // Shift key
          selected.reverse();
          const selectionReversed = beforeSelected.concat(selected).concat(afterSelected);
          this.setState({
            paletteColors: selectionReversed,
          });
          const tempMessage = 'flipping ' + amount + ' colors.';
          this.recordAction(selectionReversed, tempMessage);
          break;
        case 27: // Esc key
          if (this.state.hasSelected) {
            this.setState({
              hasSelected: false,
              warningVisible: 'collapse',
            });
          }
          break;
        case 37: // Left arrow key
          if (first > 0) {
            const popped = [beforeSelected.pop()];
            const newArray = beforeSelected.concat(selected).concat(popped).concat(afterSelected);
            const firstMinusOne = first - 1;
            const lastMinusOne = last - 1;
            setMoved(newArray, firstMinusOne, lastMinusOne);
            this.recordAction(newArray, newMessage);
          }
          break;
        case 38: // Up arrow key
          const firstMinusColumns = (first - columns > 0) ? first - columns : 0;
          const lastMinusColumns = (last - columns > amount - 1) ? last - columns : amount - 1;
          if (beforeSelected.length <= columns) {
            const newArray = selected.concat(beforeSelected).concat(afterSelected);
            setMoved(newArray, 0, lastMinusColumns);
            this.recordAction(newArray, newMessage);
          } else {
            const newBeforeSelected = beforeSelected.slice(0, beforeSelected.length - columns);
            const popped = beforeSelected.slice(beforeSelected.length - columns);
            const newArray = newBeforeSelected.concat(selected).concat(popped).concat(afterSelected);
            setMoved(newArray, firstMinusColumns, lastMinusColumns);
            this.recordAction(newArray, newMessage);
          }
          break;
        case 39: // Right arrow key
          if (last < paletteLength - 1) {
            const shifted = [afterSelected.shift()];
            const newArray = beforeSelected.concat(shifted).concat(selected).concat(afterSelected);
            const firstPlusOne = first + 1;
            const lastPlusOne = last + 1;
            setMoved(newArray, firstPlusOne, lastPlusOne);
            this.recordAction(newArray, newMessage);
          }
          break;
        case 40: // Down arrow key
          const firstPlusColumns = (first + columns <= paletteLength - 1 - amount) ? first + columns : paletteLength - amount;
          const lastPlusColumns = (last + columns < paletteLength - 1) ? last + columns : paletteLength - 1;
          if (lastPlusColumns < paletteLength - 1) {
            const newAfterSelected = afterSelected.slice(columns);
            const shifted = afterSelected.slice(0, columns);
            const newArray = beforeSelected.concat(shifted).concat(selected).concat(newAfterSelected);
            setMoved(newArray, firstPlusColumns, lastPlusColumns);
            this.recordAction(newArray, newMessage);
          } else {
            const newArray = beforeSelected.concat(afterSelected).concat(selected);
            setMoved(newArray, firstPlusColumns, paletteLength - 1);
            this.recordAction(newArray, newMessage);
          }
          break;
        case 46: // Delete key
          const colors = beforeSelected.concat(afterSelected);
          this.setState({
            hasSelected: false,
            warningVisible: 'collapse',
          })
          const message = 'deleting ' + amount + ' colors.';
          this.recordAction(colors, message);
          break;
        default:
          break;
      }
    }
  };

  onKeyUp() {
    let cursorType = (window.event.ctrlKey && window.event.altKey) ? 'pointer' : 'default';
    document.documentElement.style.setProperty('--conditionalCursor', cursorType);
  }

  setMiniPaletteColors(colorArray) {
    const leftHue = parseInt(this.getCSSvalue('--leftHue'));
    const rightHue = parseInt(this.getCSSvalue('--rightHue'));
    const leftSat = parseInt(this.getCSSvalue('--leftSaturation'));
    const rightSat = parseInt(this.getCSSvalue('--rightSaturation'));
    const leftLight = parseInt(this.getCSSvalue('--leftLightness'));
    const rightLight = parseInt(this.getCSSvalue('--rightLightness'));
    const leftAlpha = parseFloat(this.getCSSvalue('--leftAlpha'));
    const rightAlpha = parseFloat(this.getCSSvalue('--rightAlpha'));
    const sDiff = Math.abs(leftSat - rightSat);
    const lDiff = Math.abs(leftLight - rightLight);
    const aDiff = Math.abs(leftAlpha - rightAlpha);
    const compareValues = (val1, val2, diff, index) => {
      if (val2 > val1) {
        return val1 + diff * index / (colorArray.length - 1);
      } else if (val2 < val1) {
        return val1 - diff * index / (colorArray.length - 1);
      }
      return val1;
    };
    const newColorArray = colorArray.length > 1 ? colorArray.map((color, index) => {
      return 'hsla('
      + `${Math.floor(wrap(leftHue + rightHue * index / (colorArray.length - 1), 0, 360))},`
      + `${Math.floor(compareValues(leftSat, rightSat, sDiff, index))}%,`
      + `${Math.floor(compareValues(leftLight, rightLight, lDiff, index))}%,`
      + `${compareValues(leftAlpha, rightAlpha, aDiff, index)})`;
    }) : ['hsla('
      + `${Math.floor(leftHue)},`
      + `${Math.floor(leftSat)}%,`
      + `${Math.floor(leftLight)}%,`
      + `${leftAlpha})`];
    return newColorArray;
  };

  render() {
    const miniPaletteItems = this.state.miniPaletteColors.map((color, index) => {
      return (
        <div key={index} className='SampleBackground'>
          <div
            className='SampleColor' style={{backgroundColor: color}}
            id={`miniPaletteColor${index}`}
          />
        </div>
      )
    });
    const paletteItems = this.state.paletteColors.map((color, index) => {
      const hoverClass = () => {
        if (this.state.hasSelected) {
          if (index >= Math.min(this.state.firstSelected, this.state.lastSelected)
            && index <= Math.max(this.state.firstSelected, this.state.lastSelected)) {
            return 'SampleColor sampleButton selected';
          }
          return 'SampleColor sampleButton';
        }
        return 'SampleColor sampleButton';
      };
      return (
        <div
          className='SampleBackground'
          key={index}
          onContextMenu={(e)=> e.preventDefault()}
          onDragStart={(e)=> e.preventDefault()}>
          <div
            className={hoverClass()}
            id={`paletteColor${index}`}
            style={{backgroundColor: color}}
            onMouseOver={this.onSampleButtonMouseOver}
          />
        </div>
      )
    });
    const leftHue = parseInt(this.getCSSvalue('--leftHue'));
    const rightHue = parseInt(this.getCSSvalue('--rightHue'));
    const leftSat = parseInt(this.getCSSvalue('--leftSaturation'));
    const rightSat = parseInt(this.getCSSvalue('--rightSaturation'));
    const leftLight = parseInt(this.getCSSvalue('--leftLightness'));
    const rightLight = parseInt(this.getCSSvalue('--rightLightness'));
    const leftAlpha = parseFloat(this.getCSSvalue('--leftAlpha'));
    const rightAlpha = parseFloat(this.getCSSvalue('--rightAlpha'));
    const undoDisabled = this.state.actionsDone.length === 0;
    const redoDisabled = this.state.actionsReverted.length === 0;
    const exportDisabled = this.state.paletteColors.length === 0;
    return (
      <div className='app'>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
          integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
          crossOrigin="anonymous"
        />
        <div id='inputBlocker'>
          <div id='popupPanel'>
            <p className='Text CenteredText'>Download options</p>
            <div id='popupInnerPanel'>
              <div id='popupContent'>
                <div id='imagePreview'>
                  <p className='Text'>Image preview</p>
                  <div className='inputGroup'>
                    <label className='Text' htmlFor='previewSize'>Scale</label>
                    <select id='previewSize' className='optionButton' onChange={this.onPreviewSizeChanged}>
                      <option value='100%'>100%</option>
                      <option value='200%'>200%</option>
                      <option value='400%'>400%</option>
                      <option value='800%'>800%</option>
                      <option value='1200%'>1200%</option>
                      <option value='1600%'>1600%</option>
                      <option value='2000%'>2000%</option>
                      <option value='2400%'>2400%</option>
                    </select>
                    <p className='Text' id='imageResolution'>{this.state.previewResolution}</p>
                  </div> {/* inputGroup */}
                  <div id='canvasArea'>
                    <canvas id='previewCanvas'>Palette image preview</canvas>
                  </div> {/* canvasArea */}
                </div> {/* imagePreview */}
                <div className='inputGroup'>
                  <button id='cancelButton' className='textButton' onClick={this.onCancelClicked}>Cancel</button>
                  <button id='downloadJSONButton' className='textButton' onClick={this.onDownloadJSONButtonClicked}>Download as JSON</button>
                  <button id='downloadPNGButton' className='textButton' onClick={this.onDownloadPNGButtonClicked}>Download as PNG</button>
                </div> {/* inputGroup */}
              </div> {/* popupContent */}
            </div> {/* popupInnerPanel */}
          </div> {/* popupPanel */}
        </div> {/* inputBlocker */}
        <div id='top'> 
        
          <div id='header'>
            <div id='headerLeft'>
              <div className='TooltipContainer' id='undoContainer'>
                <button id='undoButton' className='iconButton' onClick={this.onUndoButtonClicked} disabled={undoDisabled}>
                  <i className='fas fa-undo'></i>
                </button>
                <span className='Tooltip TooltipBellow' id='undoTooltip'>
                  {
                    this.state.actionsDone.length > 0 ? <>
                    <p className='Text'>{'Undo ' + this.state.actionsDone[this.state.actionsDone.length - 1].message}</p>
                    <p className='Text'>(Ctrl+Z)</p> </> :
                    <p className='Text'>Nothing to undo.</p>
                  }
                </span> {/* undoTooltip */}
              </div> {/* undoContainer */}
              <div className='TooltipContainer' id='redoContainer'>
                <button id='redoButton' className='iconButton' onClick={this.onRedoButtonClicked} disabled={redoDisabled}>
                  <i className='fas fa-redo'></i>
                </button>
                <span className='Tooltip TooltipBellow' id='redoTooltip'>
                  {
                    this.state.actionsReverted.length > 0 ? <>
                    <p className='Text'>{'Redo ' + this.state.actionsReverted[this.state.actionsReverted.length - 1].message}</p>
                    <p className='Text'>(Ctrl+Alt+Z)</p></> :
                    <p className='Text'>Nothing to redo.</p>
                  }
                </span> {/* redoTooltip */}
              </div> {/* redoContainer */}
            </div> {/* headerLeft */}
            <div id='headerCenter'>
              <p className='CenteredText Text' id='title'>COLOR PALETTE MAKER</p>
            </div> {/* headerCenter */}
            <div id='headerRight'>
              <div className='TooltipContainer' id='downloadContainer'>
                <button id="exportButton" className='iconButton' onClick={this.onExportButtonClicked} disabled={exportDisabled}>
                  <i className='fas fa-download'></i>
                </button>
                <span className='Tooltip TooltipBellow' id='downloadTooltip'>
                  {
                    this.state.paletteColors.length > 0 ?
                    <p className='Text'>Click to show an image preview of the color palette and the download options.</p> :
                    <p className='Text'>Add some colors to the palette so you can download it.</p>
                  }
                </span> {/* downloadTooltip */}
              </div> {/* DownloadContainer */}
            </div> {/* headerRight */}
          </div>
          <div className='panel' id='miniPaletteContainer'>
            <div className='MiniPalette'>
              {miniPaletteItems}
            </div> {/* miniPalette */}
          </div> {/* miniPaletteContainer */}
          <div className='buttonsGroup'>
            <div className='inputGroup TooltipContainer' id='allowRepeatedContainer'>
              <label htmlFor='allowRepeated' className={this.state.allowRepeated ? 'Text Ticked': 'Text'} >Add repeated</label>
              <input type='checkbox' id='allowRepeated' className='Checkbox' defaultChecked={this.state.allowRepeated} onClick={this.onAllowRepeatedClicked}/>
              <span className='Tooltip TooltipBellow' id='allowRepeatedTooltip'>
                {
                  this.state.allowRepeated ?
                  <p className='Text'>Untoggle to allow only unique colors to be added to the color palette.</p> :
                  <p className='Text'>Toggle to allow repeated colors to be added to the color palette.</p>
                }
              </span> {/* allowRepeatedTooltip */}
            </div> {/* allowRepeatedContainer */}
            <div className='inputGroup TooltipContainer' id='colorCountContainer'>
              <label className='Text' htmlFor='MiniPaletteCount'>Swatch colors</label>
              <input type='number' id='MiniPaletteCount' className="SpinBox" min='1' max='32' value={this.state.miniPaletteColors.length} onInput={this.onColorCountChanged}/>
              <span className='Tooltip TooltipBellow' id='colorCountTooltip'>
                <p className='Text'>The amount of colors in the color swatch above.</p>
              </span> {/* colorCountTooltip */}
            </div> {/* colorCountContainer */}
            <div className='inputGroup TooltipContainer' id='addToPaletteContainer'>
              <button id='addToPalette' className='textButton' onClick={this.onAddToPaletteClicked}>Add to Palette</button>
              <span className='Tooltip TooltipBellow' id='addToPaletteTooltip'>
                {
                  this.state.allowRepeated ?
                  <p className='Text'>Click to add all colors of the color swatch to the color palette, including the repeated ones.</p> :
                  <p className='Text'>Click to add to the color palette the colors of the color swatch that are unique.</p>
                }
              </span> {/* addToPaletteTooltip */}
            </div> {/* addToPaletteContainer */}
          </div> {/* buttonsGroup */}
          <div className='panel' id='slidersAndNames'>
            <div id='leftValues'>
              <div className='LeftRightLabel' id='leftColor'>
                <div className='TooltipContainer' id='warningContainer' style={{visibility: this.state.warningVisible}}>
                  <img id='warning' src='warning.svg' alt='warning icon' className='TooltipContainer'
                  onClick={this.onWarningClicked}/>
                  <span className='Tooltip TooltipBellow' id='warningTooltip'>
                    <p className='Text'>Any change to the 'LEFT COLOR' will affect the selected colors.</p>
                    <p className='Text'>If this is not indented, click this 'Warning button' or press 'Esc' key to deselect them, or untoggle the 'Edit selected' checkbox.</p>
                  </span> {/* warningTooltip */}
                </div> {/* warningConatiner */}
                <p className='Text'>LEFT COLOR</p>
              </div> {/* leftColor */}
              <HEXcode id='leftHexValue' value={this.state.leftHex} onInput={this.onHEXtextInput}/>
              <ReactSlider
                id='leftHueSlider'
                className="colorSlider"
				trackClassName="leftHueSliderTrack"
				thumbClassName="leftHueSliderThumb"
                min={0}
                max={360}
                value={leftHue}
                onBeforeChange={() => {
				  this.setState( { beingChanged: {id: 'leftHueSlider', value: leftHue}} );
				  this.onMouseDown( {target: {id: 'leftHueSlider', value: leftHue}} )
				}}
                onChange={(valueNow) => {
				  this.onSliderInput( {target: {id: 'leftHueSlider', max: '360', value: valueNow}} )
				}}
                onAfterChange={(valueNow) => {
				  this.setState({ beingChanged: {id: 'leftHueSlider', value: valueNow} });
				  this.onMouseUp( {target: {id: 'leftHueSlider', value: valueNow}} )
				}}
              />
              <SpinBox id='leftHueSpinBox' min='0' max='360' value={wrap(leftHue, 0, 360)} onInput={this.onSpinBoxInput}/>
              <ReactSlider
                id='leftSaturationSlider'
                className="colorSlider"
				trackClassName="leftSaturationSliderTrack"
				thumbClassName="leftSaturationSliderThumb"
                min={0}
                max={100}
                value={leftSat}
                onBeforeChange={() => {
				  this.setState({ beingChanged: {id: 'leftSaturationSlider', value: leftSat} });
				  this.onMouseDown( {target: {id: 'leftSaturationSlider', value: leftSat}} )
				}}
                onChange={(valueNow) => {
				  this.onSliderInput( {target: {id: 'leftSaturationSlider', max: '100', value: valueNow}} )
				}}
                onAfterChange={(valueNow) => {
				  this.setState({ beingChanged: {id: 'leftSaturationSlider', value: valueNow} });
				  this.onMouseUp( {target: {id: 'leftSaturationSlider', value: valueNow}} )
				}}
              />
              <SpinBox id='leftSaturationSpinBox' min='0' max='100' value={clamp(leftSat, 0, 100)} onInput={this.onSpinBoxInput}/>
              <ReactSlider
                id='leftLightnessSlider'
                className="colorSlider"
				trackClassName="leftLightnessSliderTrack"
				thumbClassName="leftLightnessSliderThumb"
                min={0}
                max={100}
                value={leftLight}
                onBeforeChange={() => {
				  this.setState({ beingChanged: {id: 'leftSaturationSlider', value: leftLight} });
				  this.onMouseDown( {target: {id: 'leftSaturationSlider', value: leftLight}} )
				}}
                onChange={(valueNow) => {
			      this.onSliderInput({target: {id: 'leftLightnessSlider', max: '100', value: valueNow}})
			    }}
                onAfterChange={(valueNow) => {
				  this.setState({ beingChanged: {id: 'leftLightnessSlider', value: valueNow} });
				  this.onMouseUp( {target: {id: 'leftLightnessSlider', value: valueNow}} )
				}}
              />
              <SpinBox id='leftLightnessSpinBox' min='0' max='100' value={clamp(leftLight, 0, 100)} onInput={this.onSpinBoxInput}/>
              <ReactSlider
                id='leftAlphaSlider'
                className="colorSlider"
				trackClassName="leftAlphaSliderTrack"
				thumbClassName="leftAlphaSliderThumb"
                min={0}
                max={1}
                step={0.01}
                value={leftAlpha}
                onBeforeChange={() => {
				  this.setState({ beingChanged: {id: 'leftAlphaSlider', value: leftAlpha} });
				  this.onMouseDown( {target: {id: 'leftAlphaSlider', value: leftAlpha}} )
				}}
                onChange={(valueNow) => {
				  this.onSliderInput({target: {id: 'leftAlphaSlider', max: '1', value: valueNow}})
				}}
                onAfterChange={(valueNow) => {
				  this.setState({ beingChanged: {id: 'leftAlphaSlider', value: valueNow} });
				  this.onMouseUp( {target: {id: 'leftAlphaSlider', value: valueNow}} )
				}}
              />
              <SpinBox id='leftAlphaSpinBox' min='0' max='100' step='1' value={clamp(Math.round(leftAlpha * 100), 0, 100)} onInput={this.onSpinBoxInput}/>
            </div> {/* leftValues */}
            <div id='valueNames'>
              <p className='Text CenteredText' id='hexLabel'>HEX CODE</p>
              <p className='Text CenteredText' id='hueLabel'>HUE</p>
              <p className='Text CenteredText' id='saturationLabel'>SATURATION</p>
              <p className='Text CenteredText' id='lightnessLabel'>LIGHTNESS</p>
              <p className='Text CenteredText' id='alphaLabel'>ALPHA</p>
            </div> {/* valueNames */}
            <div id='rightValues'>
              <HEXcode id='rightHexValue' value={this.state.rightHex} onInput={this.onHEXtextInput} disabled={this.state.valuesDisabled}/>
              <p className='Text LeftRightColors' id='rightColor'>RIGHT COLOR</p>
              <SpinBox id='rightHueSpinBox' min='0' max='360' value={wrap(this.calculateRightHue(), 0, 360)} onInput={this.onSpinBoxInput} disabled={this.state.valuesDisabled}/>
              <ReactSlider
                id='rightHueSlider'
                className="colorSlider"
				trackClassName="rightHueSliderTrack"
				thumbClassName="rightHueSliderThumb"
				marks={[0]}
                markClassName="rightHueSliderMark"
                min={-360}
                max={360}
                value={rightHue}
                disabled={Boolean(this.state.valuesDisabled)}
                onChange={(valueNow) => {
				  this.onSliderInput({target: {id: 'rightHueSlider', max: '360', value: valueNow}})
				}}
              />
              <SpinBox id='rightSaturationSpinBox' min='0' max='100' value={clamp(rightSat, 0, 100)} onInput={this.onSpinBoxInput} disabled={this.state.valuesDisabled}/>
              <ReactSlider
                id='rightSaturationSlider'
                className="colorSlider"
				trackClassName="rightSaturationSliderTrack"
				thumbClassName="rightSaturationSliderThumb"
                min={0}
                max={100}
                value={rightSat}
                disabled={Boolean(this.state.valuesDisabled)}
                onChange={(valueNow) => {
				  this.onSliderInput({target: {id: 'rightSaturationSlider', max: '100', value: valueNow}})
				}}
              />
              <SpinBox id='rightLightnessSpinBox' min='0' max='100' value={clamp(rightLight, 0, 100)} onInput={this.onSpinBoxInput} disabled={this.state.valuesDisabled}/>
              <ReactSlider
                id='rightLightnessSlider'
                className="colorSlider"
				trackClassName="rightLightnessSliderTrack"
				thumbClassName="rightLightnessSliderThumb"
                min={0}
                max={100}
                value={rightLight}
                disabled={Boolean(this.state.valuesDisabled)}
                onChange={(valueNow) => {
				  this.onSliderInput({target: {id: 'rightLightnessSlider', max: '100', value: valueNow}})
				}}
              />
              <SpinBox id='rightAlphaSpinBox' min='0' max='100' value={clamp(Math.round(rightAlpha * 100), 0, 100)} onInput={this.onSpinBoxInput} disabled={this.state.valuesDisabled}/>
              <ReactSlider
                id='rightAlphaSlider'
                className="colorSlider"
				trackClassName="rightAlphaSliderTrack"
				thumbClassName="rightAlphaSliderThumb"
                min={0}
                max={1}
                step={0.01}
                value={rightAlpha}
                disabled={Boolean(this.state.valuesDisabled)}
                onChange={(valueNow) => {
				  this.onSliderInput({target: {id: 'rightAlphaSlider', max: '1', value: valueNow}})
			    }}
              />
            </div> {/* rightValues */}
          </div> {/* slidersAndNames */}
          <div className='buttonsGroup'>
            <div className='inputGroup TooltipContainer' id='editSelectedContainer'>
              <label htmlFor='changeSelected' className={this.state.editSelectedChecked ? 'Text Ticked': 'Text'}>Edit selected</label>
              <input type='checkbox' id='changeSelected' className='Checkbox' defaultChecked={this.state.editSelectedChecked} onClick={this.onChangeSelectedClicked}/>
              <span className='Tooltip TooltipBellow' id='editSelectedTooltip'>
                {
                  this.state.editSelectedChecked ?
                  <p className='Text'>Untoggle to avoid editing the selected colors.</p> :
                  <p className='Text'>Toggle to allow editing the selected colors.</p>
                }
              </span> {/* editSelectedTooltip */}
            </div> {/* editSelectedContainer */}
            <div className='inputGroup TooltipContainer' id='columnCountContainer'>
              <label className='Text' htmlFor='columnCount'>Columns</label>
              <input type='number' id='columnCount' className="SpinBox" min='1' max='32' value={this.state.columnCount} onInput={this.onColumnCountChanged}/>
              <span className='Tooltip TooltipBellow' id='columnCountTooltip'>
                <>
                  <p className='Text'>The amount of columns in the color palette.</p>
                  <p className='Text'>The amount of lines is determined by the amount of colors and columns.</p>
                </>
              </span>
            </div> {/* columnCountContainer */}
          </div> {/* buttonsGroup */}
        </div> {/* top */}
        <div id='bottom'>
          <div className='panel TooltipContainer' id='paletteContainer'>
            <div className='colorPalette'>
              {paletteItems}
            </div> {/* colorPalette */}
            <span className='Tooltip TooltipAbove' id='paletteToolTip'>
              {
                <>
                  <p className='Text'><span className='AccentText'>Colors: </span>{this.state.paletteColors.length}</p>
                  <p className='Text'><span className='AccentText'>Selected: </span>
                    { this.state.hasSelected ? Math.abs(this.state.firstSelected - this.state.lastSelected) + 1 : 0 }
                  </p>
                  <p className='Text'><span className='AccentText'>Edit selected: </span>
                    {this.state.editSelectedChecked ? 'True' : 'False'}
                  </p>
                  <p className='Text'><span className='AccentText'>??? Left mouse click / drag:</span> Select colors.</p>
                  <p className='Text'><span className='AccentText'>??? Esc key: </span> Deselect colors.</p>
                  <p className='Text'><span className='AccentText'>??? Arrow keys:</span> Move selected colors.</p>
                  <p className='Text'><span className='AccentText'>??? Shift key:</span> Invert the order of the selected colors.</p>
                  <p className='Text'><span className='AccentText'>??? Delete key:</span> Delete selected colors.</p>
                  <p className='Text'><span className='AccentText'>??? Ctrl + Alt + left mouse click:</span> Make LEFT COLOR (and selected colors if "Edit selected" is true) to be equal to the clicked color.</p>
                  <p className='Text'><span className='AccentText'>??? Ctrl + Alt + right mouse click:</span> Make RIGHT COLOR to be equal to the clicked color.</p>
                </>
              }
            </span> {/* paletteToolTip */}
          </div> {/* paletteContainer */}
        </div> {/* bottom */}
      </div>
    )
  };
};


class SpinBox extends React.Component {
  render() {
    return (
      <input
        type="number"
        className="SpinBox"
        id={this.props.id}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        value={this.props.value}
        onInput={this.props.onInput}
        disabled={this.props.disabled}
      />
    )
  }
};


class HEXcode extends React.Component {
  render() {
    return (
      <input
        type='text'
        minLength='1'
        maxLength='9'
        className='hexValue'
        id={this.props.id}
        value={this.props.value}
        onInput={this.props.onInput}
        disabled={this.props.disabled}
      />
    )
  }
}

function imageFromPalette(width, colorArr) {
  const height = () => {
    let lines = 1;
    while (lines < colorArr.length / width) {
      lines++;
    }
    return lines;
  } ;
  const canvas = document.getElementById('previewCanvas');
  canvas.width = parseInt(width);
  canvas.height = height();
  let ctx = canvas.getContext('2d');
  let imgData = ctx.createImageData(parseInt(width), height());
  let colorSamples = document.getElementsByClassName('sampleButton');
  let pixel = 0;
  for (let i = 0; i < colorSamples.length; i++) {
    const color = (
      colorSamples[i].style['background-color'].startsWith('rgba(') ?
      colorSamples[i].style['background-color'].replace('rgba(', '').replace(')', '').split(',') :
      colorSamples[i].style['background-color'].replace('rgb(', '').replace(')', '').split(',')
    );
    const alpha = colorArr[i].slice(colorArr[i].lastIndexOf(',') + 1 ).replace(')', '');
    imgData.data[pixel+0] = parseInt(color[0]);
    imgData.data[pixel+1] = parseInt(color[1]);
    imgData.data[pixel+2] = parseInt(color[2]);
    imgData.data[pixel+3] = Math.round(alpha * 255);
    pixel += 4;
  };
  ctx.putImageData(imgData, 0, 0);
  image.src = canvas.toDataURL();
  canvasSize = {w: canvas.width, h: canvas.height};
}


function wrap(val, minVal, maxVal) {
  return (val < minVal) ? maxVal - (minVal - val) % (maxVal - minVal) : minVal + (val - minVal) % (maxVal - minVal);
};


function clamp(val, minVal, maxVal) {
  return (val < minVal) ? minVal : (val > maxVal) ? maxVal : val;
};


function RGBtoHSL(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
    ? (g - b) / s
    : l === g
    ? 2 + (b - r) / s
    : 4 + (r - g) / s
    : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
};


function HSLtoRGB(h, s, l) {
  var r, g, b;
  h /= 360;
  s /= 100;
  l /= 100;
  if(s === 0){
      r = g = b = l;
  }else{
    var hue2rgb = function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
