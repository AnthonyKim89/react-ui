import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
class TFOChart extends Component {

  constructor(props) {
    super(props);    
    this.prevCanvasDimension = {};
    this.canvasDimension = {};
    this.prevCanvasPosition = {};
    this.canvasPosition = {};
  }

  componentDidMount() {
    this.onResizing();
    window.addEventListener("resize", this.onResizing.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResizing);
  }
  
  shouldComponentUpdate(nextProps,nextState) {        
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this.draw();
    }
    return false;
  }

  render() {
    return (
      <canvas ref={(canvas)=>this.canvas=canvas}></canvas>
    );
  }

  onResizing() {
    this.setCanvasProperty();
    if (this.checkPositionChange()) {
      this.rePositionCanvas();      
    }
    if (this.checkDimensionChange()) {
      this.resizeCanvas();
      this.draw();
    }      
  }

  draw() {    
    if (this.canvas) {
      this.drawPlot();
      this.drawData();
    }
  }

  checkDimensionChange() {
    if (JSON.stringify(this.canvasDimension) !== JSON.stringify(this.prevCanvasDimension)) {
      this.prevCanvasDimension = Object.assign({}, this.canvasDimension);
      return true;
    }
    return false;
  }

  checkPositionChange() {
   if (JSON.stringify(this.canvasPosition) !== JSON.stringify(this.prevCanvasPosition)) {
      this.prevCanvasPosition = Object.assign({}, this.canvasPosition);
      return true;
    }
    return false; 
  }

  drawPlot() {

    let ctx = this.getCanvasCtx();
    let {cx,cy,outR,r4,r3,r2,r1,r0} = this.getCanvasAxisData();

    // background plot;
    this.drawCircle(ctx,cx,cy,outR,null,"#565656");

    // r4 plot;
    this.drawCircle(ctx,cx,cy,r4,"#fff","#333");

    // r3 plot;
    this.drawCircle(ctx,cx,cy,r3,"#fff");

    // r2 plot;
    this.drawCircle(ctx,cx,cy,r2,"#fff");

    // r1 plot;
    this.drawCircle(ctx,cx,cy,r1,"#fff");

    // r0 plot;
    this.drawCircle(ctx,cx,cy,r0,"#fff","#000");

    // x axis;
    this.drawLine(ctx,cx-r4,cy,cx-r0,cy,"#fff");
    this.drawLine(ctx,cx+r0,cy,cx+r4,cy,"#fff");

    //y axis;
    this.drawLine(ctx,cx,cy-r4,cx,cy-r0,"#fff");
    this.drawLine(ctx,cx,cy+r0,cx,cy+r4,"#fff");

    // axis text - hide in small parent size;
    this.drawText(ctx, "0", 12, cx-3, cy-r4-5);
    this.drawText(ctx, "0", 12, cx-3, cy+r4+12);
    this.drawText(ctx, "90L", 12, cx-r4-20, cy+3);
    this.drawText(ctx, "90R", 12, cx+r4+3, cy+3);

    // latest tfo data;
    let latestTFO = this.getLatestTFO();
    if (latestTFO) {      
      let fSizeSmall = (r4-r3);
      let fSize = fSizeSmall*3;
      this.drawText(ctx,"Gravity TFO",fSizeSmall,cx-r0/2-fSizeSmall/2, cy-r0/3);
      this.drawText(ctx,latestTFO["tfo"],fSize,cx-r0/3-fSize/3, cy-r0/3+fSize);
    }

  }

  drawData() {    
    let ctx = this.getCanvasCtx();
    let {cx,cy,r3,r4} = this.getCanvasAxisData();

    let {ox,oy} = this.calcPosition();
    let colors=["#2f6a8b","#3c85af","#479dcf","#84cffd","#a7ddfe"];
    for (let i=0; i<ox.length; i++) {
      let _ox = ox[i];
      let _oy = oy[i];
      let r = (r4-r3)/2*(i*0.15+0.7);      

      // our center point is (cx,cy) not (0,0) , so we need to transform axis
      // in canvas coordinate system , y axis is reverse. so, we should minus
      this.drawCircle(ctx,cx+_ox,cy-_oy,r,"#fff",colors[i]);
    }
  }

  drawCircle(ctx,cx,cy,r,strokeColor,fillColor) {
    ctx.beginPath();    
    ctx.arc(cx,cy,r,0,2*Math.PI,true);
    ctx.closePath();
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
  }

  drawLine(ctx,x1,y1,x2,y2,strokeColor) {
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }

  drawText(ctx,text,fontSize,x,y) {
    ctx.font = fontSize+"px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText(text,x,y);
  }

  getCanvasCtx() {
    return this.canvas.getContext('2d');
  }

  getTFORawData() {
    // assumptions
    // 1. there are 5 slides, in case more than 5, slice it.
    // 2. data is in descending order by timestamp; that means last item in json is oldest, first is newest.
    return this.props.data.slice(0,5).toJS();
  };

  getLatestTFO() {
    // assume that first item in array is the latest data
    let data = this.getTFORawData();
    if (data.length>0) {
      return data[0];
    }
  }

  sin(degree) {
    return Math.sin(degree/180*Math.PI);
  }

  cos(degree) {
    return Math.cos(degree/180*Math.PI);
  }

  calcPosition() {
    
    let data = this.getTFORawData();
    let size = data.length-1;

    let {r0,r1,r2,r3,r4} = this.getCanvasAxisData();
    let r = [r4,r3,r2,r1,r0];
    
    let c = [];
    let x = [];
    let y =[];

    let x0 = r[size] * this.sin(data[size].tfo);    
    let y0 = r[size] * this.cos(data[size].tfo);
    let xn = r[0] * this.sin(data[0].tfo);
    let yn = r[0] * this.cos(data[0].tfo);

    for (let i=size; i>=0; i--) {
      let item = data[i];
      let _sin = this.sin(item.tfo);
      let _cos = this.cos(item.tfo);
      let _x0 = r[size] * _sin;
      let _y0 = r[size] * _cos;
      let _xn = r[0] * _sin;
      let _yn = r[0] * _cos;
      

      if (i===size) {
        c.push(0);
        x.push(x0);
        y.push(y0);        
      }
      else if (i===0) {
        c.push(size);
        x.push(xn);
        y.push(yn);
      }
      else {
        let _c = size* (item.timestamp - data[size].timestamp) / (data[0].timestamp - data[size].timestamp);
        let _x = _c/size * (_xn-_x0) + _x0;
        let _y = _c/size * (_yn-_y0) + _y0;
        x.push(_x);
        y.push(_y);

      }
    }

    return {ox:x, oy:y};
  }

  getCanvasAxisData() {
    let {width,height} = this.canvasDimension;
    let cx = width/2;
    let cy = height/2;
    let outR = width/2 -5;
    let r4 = outR * 0.8;
    let r3 = outR * 0.7;
    let r2 = outR * 0.6;
    let r1 = outR * 0.5;
    let r0 = outR * 0.4;
    return {cx,cy,outR,r0,r1,r2,r3,r4};
  }

  resizeCanvas() {    
    let {width,height} = this.canvasDimension;
    this.canvas.width = width;
    this.canvas.height = height;    
  }

  rePositionCanvas() {
    let {marginTop,marginLeft} = this.canvasPosition;
    this.canvas.style.marginTop = marginTop + "px";
    this.canvas.style.marginLeft = marginLeft + "px";    
  }

  setCanvasProperty() {
    let containerDom = document.getElementById(this.props.container);
    let containerWidth = containerDom.offsetWidth;
    let containerHeight = containerDom.offsetHeight;
    let cDiff = Math.abs(containerWidth-containerHeight);    
    let marginTop = 0;
    let marginLeft = 0;
    let width,height;
    if (containerWidth>containerHeight) {
      width = height = containerHeight;
      marginLeft = cDiff/2;
    }    
    else {
      width = height = containerWidth ;
      marginTop = cDiff/2;
    }    

    this.canvasDimension = {width,height};
    this.canvasPosition = {marginTop,marginLeft};
  }  

}

TFOChart.propTypes = {
  container: PropTypes.string,
  data: ImmutablePropTypes.list
};
export default TFOChart;