import React from 'react'
//import { Test } from './PhotoEditor.styles';
import { fabric } from 'fabric' // this also installed on your project
import './style.css'
import { Steps } from 'antd';

const { Step } = Steps;
let canvas
class PhotoEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      clicks: 0,
      id: "someUniqueId", // I would use this.props.id for a real world implementation
      imageURI: null,
      canvas: null,
      background: false,
      square: false,
      rotation: 0,
      currentTab: 0
    }
  }

  componentDidMount() {
    canvas = new fabric.Canvas('c')
    this.setState({ canvas: canvas })

    let c = this
    function getMousePosition(canvasTarget, event) {
      let rect = canvasTarget.getBoundingClientRect()
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top
      console.log(c.state.clicks === 0 && c.state.imageURI)
      if (c.state.clicks === 0 && c.state.imageURI) {
        c.setState({ left: x, top: y })
      } else if (c.state.clicks === 1 && c.state.imageURI){
        c.setState({ right: x, bottom: y })
        c.handleClick()
        c.setState({currentTab: 2})
      }
      c.setState({ clicks: c.state.clicks + 1 })
    }

    let canvasElem = document.querySelector('canvas.upper-canvas')

    canvasElem.addEventListener('mousedown', function (e) {
      getMousePosition(canvasElem, e)
    })
  }
  handleClick = () => {
    var rectDraw = new fabric.Rect({
      left: this.state.left,
      top: this.state.top,
      bottom: this.state.bottom,
      right: this.state.right,
      // fill: 'red',
      height: this.state.bottom - this.state.top,
      width: this.state.right - this.state.left,
      
    })
    // "add" rectangle onto canvas
    canvas.add(rectDraw)
    this.setState({ square: true })
  }

  buildImgTag() {
    if (this.state.background === false && this.state.imageURI) {
      let c = this
      fabric.Image.fromURL(this.state.imageURI, function (oImg) {
        if (c.state.canvas) {
          let scale = c.state.canvas.height / oImg.height > c.state.canvas.width / oImg.width ? c.state.canvas.width / oImg.width : c.state.canvas.height / oImg.height
          oImg.scaleY = scale
          oImg.scaleX = scale
          oImg.originX = 'middle'
          oImg.originY = 'middle'
          oImg.selectable = false
          c.state.canvas.add(oImg);
        }
        c.setState({ background: oImg })
        c.setState({currentTab: 1})
        oImg.center()
      })
    }
  }

  readURI(e) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (ev) {
        this.setState({ imageURI: ev.target.result });
      }.bind(this);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  handleFileChange(e) {
    this.readURI(e); // maybe call this with webworker or async library?
    if (this.props.onChange !== undefined)
      this.props.onChange(e); // propagate to parent component

  }

  onSlideChange(val){
    this.setState({rotation:val})
    if (this.state.background){
      canvas.item(0).angle = parseInt(val)
  }
  canvas.renderAll()
  }
  render() {
    const imgTag = this.buildImgTag();
    return (
      <div style={{width: '100vw'}}>
     <Steps size="small" current={this.state.currentTab}>
    <Step title="Upload image of your house" />
    <Step title="Select door placement" />
    <Step title="Finish" />
  </Steps>
        <center>
        <canvas id='c' className='canvas' height='700px' width='700px' style={{
         boxShadow:'0px 0px 0.5rem grey',
        //  border: '1px solid black',
        }}>

        </canvas>
          </center>
    
        {
        this.state.imageURI ?
          null  
          :
          <div>
            <label
              htmlFor={this.state.id}
              className="button">
              Upload an image
                </label>
            <input
              id={this.state.id}
              type="file"
              onChange={this.handleFileChange.bind(this)}
              className="show-for-sr" />
            <div
            //  style={{display:"none"}}
            >{imgTag}</div>
          </div>
        }
        <div class="slidecontainer">
        <input type="range" min="-90" max="90" step="1" value={this.state.rotation} className="slider" id="image-rotation" onChange={(e) => this.onSlideChange(e.target.value)}/>
      </div>

      </div>
      
    )
  }
}

export default PhotoEditor
