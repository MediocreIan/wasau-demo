import React from 'react'
//import { Test } from './PhotoEditor.styles';
import { fabric } from 'fabric' // this also installed on your project
import './style.css'
let canvas
class PhotoEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      clicks: 0,
      id : "someUniqueId", // I would use this.props.id for a real world implementation
      imageURI : null,
      canvas: null,
      background: false
    }
  }

  componentDidMount () {
    canvas = new fabric.Canvas('c')
    this.setState({canvas:canvas})

    let c = this
    function getMousePosition (canvasTarget, event) {
      let rect = canvasTarget.getBoundingClientRect()
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top
      console.log('Coordinate x: ' + x, 'Coordinate y: ' + y)
      if (c.state.clicks % 2 === 0) {
        c.setState({ left: x, top: y })
      } else {
        c.setState({ right: x, bottom: y })
      }
      c.setState({ clicks: c.state.clicks + 1 })
    }

    let canvasElem = document.querySelector('canvas.upper-canvas')

    canvasElem.addEventListener('mousedown', function (e) {
      getMousePosition(canvasElem, e)
      console.log('e')
    })
  }
  handleClick = () => {
    var rectDraw = new fabric.Rect({
      left: this.state.left,
      top: this.state.top,
      bottom: this.state.bottom,
      right: this.state.right,
      fill: 'red',
      height: this.state.bottom - this.state.top,
      width: this.state.right - this.state.left
      // angle: 45
    })
    console.log({
      left: this.state.left,
      top: this.state.top,
      bottom: this.state.bottom,
      right: this.state.right,
      fill: 'red',
      width: 300,
      height: 300
    })
    // "add" rectangle onto canvas
    canvas.add(rectDraw)
  }

  buildImgTag(){
    if(this.state.background === false && this.state.imageURI){
    let c = this
    fabric.Image.fromURL(this.state.imageURI, function(oImg) {
      if(c.state.canvas){
        oImg.width = c.state.canvas.width;
        oImg.height = c.state.canvas.height;
        oImg.left = 0;
        oImg.top = 0;
        oImg.padding = 0
        // oImg.selectable = false
        console.log(oImg)
        c.state.canvas.add(oImg);
    }
    });
    this.setState({background:true})
  }
  }
  
  readURI(e){
    if(e.target.files && e.target.files[0]){
      let reader = new FileReader();
      reader.onload = function(ev){
        this.setState({imageURI:ev.target.result});
      }.bind(this);
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  
  handleChange(e){
    this.readURI(e); // maybe call this with webworker or async library?
    if (this.props.onChange !== undefined)
      this.props.onChange(e); // propagate to parent component

  }
  render () {
    const imgTag = this.buildImgTag();
    return (
      <div style={{ width: '100vw' }}>
        <canvas id='c' className='canvas' height='700px' width='700px'></canvas>
        <button onClick={e => this.handleClick()}>make a box</button>
        <div>
            <label
              htmlFor={this.state.id}
              className="button">
              Upload an image
            </label>
            <input
              id={this.state.id}
              type="file"
              onChange={this.handleChange.bind(this)}
              className="show-for-sr" />
            <div
            //  style={{display:"none"}}
             >{imgTag}</div>
          </div>
      </div>
    )
  }
}

export default PhotoEditor
