import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Label from './label';

import styled from 'styled-components';
import remcalc from 'remcalc';
import theme from '../../../theme';

export const SliderStyled = styled.div`
  appearance: none;
  background: ${theme.white};
  border: 2px solid ${theme.greyLight};
  border-radius: 50%;
  cursor: pointer;
  display: block;
  height: ${remcalc(14)};
  width: ${remcalc(14)};
  transform: ${props =>
    props.type === 'max'
      ? 'translateY(-50%) translateX(-99%)'
      : 'translateY(-50%) translateX(-1%)'};
  outline: none;
  position: absolute;
  top: 0;
  margin-top: ${remcalc(2)};

  &::active {
    transform: scale(1.3);
  }

  &::focus {
    box-shadow: 0 0 0 5px rgba(63, 81, 181, 0.2);
  }
`;

/**
 * @ignore
 */
export default class Slider extends Component {
  /**
   * Accepted propTypes of Slider
   * @override
   * @return {Object}
   * @property {Function} ariaLabelledby
   * @property {Function} ariaControls
   * @property {Function} className
   * @property {Function} formatLabel
   * @property {Function} maxValue
   * @property {Function} minValue
   * @property {Function} onSliderDrag
   * @property {Function} onSliderKeyDown
   * @property {Function} percentage
   * @property {Function} type
   * @property {Function} value
   */
  static get propTypes() {
    return {
      ariaLabelledby: PropTypes.string,
      ariaControls: PropTypes.string,
      classNames: PropTypes.objectOf(PropTypes.string).isRequired,
      formatLabel: PropTypes.func,
      maxValue: PropTypes.number,
      minValue: PropTypes.number,
      onSliderDrag: PropTypes.func.isRequired,
      onSliderKeyDown: PropTypes.func.isRequired,
      percentage: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    };
  }

  /**
   * @param {Object} props
   * @param {string} [props.ariaLabelledby]
   * @param {string} [props.ariaControls]
   * @param {InputRangeClassNames} props.classNames
   * @param {Function} [props.formatLabel]
   * @param {number} [props.maxValue]
   * @param {number} [props.minValue]
   * @param {Function} props.onSliderKeyDown
   * @param {Function} props.onSliderDrag
   * @param {number} props.percentage
   * @param {number} props.type
   * @param {number} props.value
   */
  constructor(props) {
    super(props);

    /**
     * @private
     * @type {?Component}
     */
    this.node = null;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * @ignore
   * @override
   * @return {void}
   */
  componentWillUnmount() {
    this.removeDocumentMouseMoveListener();
    this.removeDocumentMouseUpListener();
    this.removeDocumentTouchEndListener();
    this.removeDocumentTouchMoveListener();
  }

  /**
   * @private
   * @return {Object}
   */
  getStyle() {
    const perc = (this.props.percentage || 0) * 100;
    const style = {
      position: 'absolute',
      left: `${perc}%`
    };

    return style;
  }

  /**
   * Listen to mousemove event
   * @private
   * @return {void}
   */
  addDocumentMouseMoveListener() {
    this.removeDocumentMouseMoveListener();
    this.node.ownerDocument.addEventListener('mousemove', this.handleMouseMove);
  }

  /**
   * Listen to mouseup event
   * @private
   * @return {void}
   */
  addDocumentMouseUpListener() {
    this.removeDocumentMouseUpListener();
    this.node.ownerDocument.addEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * Listen to touchmove event
   * @private
   * @return {void}
   */
  addDocumentTouchMoveListener() {
    this.removeDocumentTouchMoveListener();
    this.node.ownerDocument.addEventListener('touchmove', this.handleTouchMove);
  }

  /**
   * Listen to touchend event
   * @private
   * @return {void}
   */
  addDocumentTouchEndListener() {
    this.removeDocumentTouchEndListener();
    this.node.ownerDocument.addEventListener('touchend', this.handleTouchEnd);
  }

  /**
   * @private
   * @return {void}
   */
  removeDocumentMouseMoveListener() {
    this.node.ownerDocument.removeEventListener(
      'mousemove',
      this.handleMouseMove
    );
  }

  /**
   * @private
   * @return {void}
   */
  removeDocumentMouseUpListener() {
    this.node.ownerDocument.removeEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * @private
   * @return {void}
   */
  removeDocumentTouchMoveListener() {
    this.node.ownerDocument.removeEventListener(
      'touchmove',
      this.handleTouchMove
    );
  }

  /**
   * @private
   * @return {void}
   */
  removeDocumentTouchEndListener() {
    this.node.ownerDocument.removeEventListener(
      'touchend',
      this.handleTouchEnd
    );
  }

  /**
   * @private
   * @return {void}
   */
  handleMouseDown() {
    this.addDocumentMouseMoveListener();
    this.addDocumentMouseUpListener();
  }

  /**
   * @private
   * @return {void}
   */
  handleMouseUp() {
    this.removeDocumentMouseMoveListener();
    this.removeDocumentMouseUpListener();
  }

  /**
   * @private
   * @param {SyntheticEvent} event
   * @return {void}
   */
  handleMouseMove(event) {
    this.props.onSliderDrag(event, this.props.type);
  }

  /**
   * @private
   * @return {void}
   */
  handleTouchStart() {
    this.addDocumentTouchEndListener();
    this.addDocumentTouchMoveListener();
  }

  /**
   * @private
   * @param {SyntheticEvent} event
   * @return {void}
   */
  handleTouchMove(event) {
    this.props.onSliderDrag(event, this.props.type);
  }

  /**
   * @private
   * @return {void}
   */
  handleTouchEnd() {
    this.removeDocumentTouchMoveListener();
    this.removeDocumentTouchEndListener();
  }

  /**
   * @private
   * @param {SyntheticEvent} event
   * @return {void}
   */
  handleKeyDown(event) {
    this.props.onSliderKeyDown(event, this.props.type);
  }

  /**
   * @override
   * @return {JSX.Element}
   */
  render() {
    const style = this.getStyle();
    const props = this.props;

    return (
      <span
        ref={node => {
          this.node = node;
        }}
      >
        <Label formatLabel={props.formatLabel} type={props.type}>
          {props.value}
        </Label>
        <SliderStyled
          type={props.type}
          style={style}
          aria-labelledby={props.ariaLabelledby}
          aria-controls={props.ariaControls}
          aria-valuemax={props.maxValue}
          aria-valuemin={props.minValue}
          aria-valuenow={props.value}
          draggable="false"
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleTouchStart}
          role="slider"
          tabIndex="0"
        />
      </span>
    );
  }
}
