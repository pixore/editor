import React from 'react'

import { getContext } from '../../../../constants'
import { imageSmoothingDisabled, clean } from '../../../../utils/canvas'
const obj = {}

obj.displayName = 'Main'

obj.getInitialState = () => ({})

obj.componentDidMount = function () {
  let context = this.refs.canvas.getContext('2d')
  this.setState({ context })
  this.props.setContext('main', context)
}

obj.shouldComponentUpdate = function (nextProps, nextState) {
  const isAnotherLayer = this.props.layer.id !== nextProps.layer.id
  const isAnotherArtboard = this.props.artboard !== nextProps.artboard
  const isNewVersion = nextProps.layer.version !== this.props.layer.version
  if (this.state && this.state.context && isNewVersion) {
    this.paint(nextState.context, nextProps.artboard, nextProps.layer)
  }
  return isAnotherLayer && isAnotherArtboard
}

obj.paint = function (context, artboard, layer) {
  let width = (layer.width * artboard.scale)
  let height = (layer.height * artboard.scale)
  clean(context.canvas)
  imageSmoothingDisabled(context)
  context.drawImage(getContext(layer.id).canvas,
    0, 0, layer.width, layer.height,
    artboard.x, artboard.y, width, height)
}

obj.componentDidUpdate = function () {
  if (this.state && this.state.context && this.props.layer && this.props.artboard) {
    this.paint(this.state.context, this.props.artboard, this.props.layer)
  }
}

obj.render = function () {
  return <canvas
    ref='canvas'
    style={this.props.style}
    width={this.props.size.width}
    height={this.props.size.height}
    className='main' />
}

const Main = React.createClass(obj)

export default Main
