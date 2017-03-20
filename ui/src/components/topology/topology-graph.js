import styled from 'styled-components';
import { Baseline } from '../../shared/composers';
import { createSimulation, updateSimulation } from './graph-simulation';
import Constants from './constants';
import GraphNode from './graph-node';
import GraphLink from './graph-link';
import React from 'react';
import { triggerMouseEvent } from '../../shared/functions';

const StyledSvg = styled.svg`
  width: 100%;
  height: 860px;
`;

const svgSize = {
  width: 1024,
  height: 860
};

let dragInfo = {
  dragging: false,
  nodeId: null,
  position: null
};

class TopologyGraph extends React.Component {

  componentWillMount() {
    const services = this.props.services.reduce((acc, service, index) => {
      if(service.id !== 'consul') acc.push(service);
      return acc;
    }, []);

    const simulationData = createSimulation(
      services,
      svgSize//,
      //() => this.forceUpdate(),
      //() => this.forceUpdate()
    );

    const simulation = simulationData.simulation;

    const n = Math.ceil(
      Math.log(
        simulation.alphaMin()) / Math.log(
        1 - simulation.alphaDecay()));
    for (var i = 0; i < n; ++i) {
      simulation.tick();
    }

    this.setState(simulationData);
  }

  componentWillReceiveProps(nextProps) {
    // either, we'll have more services
    // or, we'll have less services
    // or, data of services had changed =>
    //  do shallow check on objects and links, if no change, don't do rerender
    //  otherwise, redo them bitches = by what I mean to update the simulation
    //  try freezing exisiting ones... then adding another

    const {
      nodes,
      links
    } = this.state;

    const services = nextProps.services.reduce((acc, service, index) => {
      if(service.id !== 'consul') acc.push(service);
      return acc;
    }, []);
    // TODO this here means we'll need to evaluate whether to we have more links!

    // this is tmp for the compare above
    if(services !== nodes.length) {
      const simulation = this.state.simulation;
      const nextSimulationData = updateSimulation(
        simulation,
        services,
        nodes,
        links,
        svgSize,
        () => this.forceUpdate(),
        () => this.forceUpdate()
      );

      const nextSimulation = nextSimulationData.simulation;
      // console.log('nextSimulationData.nodes = ', nextSimulationData.nodes);

      const n = Math.ceil(
        Math.log(
          nextSimulation.alphaMin()) / Math.log(
          1 - nextSimulation.alphaDecay()));
      for (var i = 0; i < n; ++i) {
        nextSimulation.tick();
      }

      //this.state.simulation.nodes().forEach((node, index) => {
      //  delete node.fx;
      //  delete node.fy;
      //});

      this.setState(nextSimulationData);
    }
  }

  isWithinSVGBounds(target, x, y) {
    const svgBounds = document
      .getElementsByClassName('topology-svg')[0]
      .getBoundingClientRect();

    const nodeHeight = target.getBoundingClientRect().height;
    const nodeWidth = target.getBoundingClientRect().width;

    const constraints = {
      top: svgBounds.top + (nodeHeight / 2),
      left: svgBounds.left + (nodeWidth / 2),
      bottom: svgBounds.bottom - (nodeHeight / 2),
      right: svgBounds.right - (nodeWidth / 2)
    };

    if ( x > constraints.right || x < constraints.left ) return false;

    if ( y < constraints.top || y > constraints.bottom ) return false;

    return true;
  }

  render() {

    const {
      onQuickActions,
      services
    } = this.props;

    const {
      nodes,
      links
    } = this.state;

    const simNode = (nodeId) =>
      nodes.reduce((acc, simNode, index) =>
        simNode.id === nodeId ? simNode : acc, {});

    const nodesData = services.map((service, index) => {
      const sNode = service.id === 'consul' ? {
        x: svgSize.width - Constants.nodeSize.width,
        y: 0
      } : simNode(service.uuid);

      return ({
        ...service,
        ...sNode
      });
    });

    const nodeData = (nodeId) =>
      nodesData.reduce((acc, nodeData, index) =>
        nodeData.id === nodeId ? nodeData : acc, {});
    // TODO links will need to know whether a service has children
    // if it does, the height of it will be different
    const linksData = links.map((link, index) => ({
      source: nodeData(link.source.id),
      target: nodeData(link.target.id)
    }));

    const onDragStart = (evt, nodeId) => {
      // it's this node's position that we'll need to update
      dragInfo.dragging = true;
      dragInfo.nodeId = nodeId;

      const x = evt.changedTouches ? evt.changedTouches[0].pageX : evt.clientX;
      const y = evt.changedTouches ? evt.changedTouches[0].pageY : evt.clientY;

      dragInfo.position = {
        x,
        y
      };
    };

    const onDragMove = (evt) => {

      if ( dragInfo.dragging ) {

        const x = evt.changedTouches
          ? evt.changedTouches[0].pageX
          : evt.clientX;
        const y = evt.changedTouches
          ? evt.changedTouches[0].pageY
          : evt.clientY;

        if ( !this.isWithinSVGBounds(evt.target, x, y) ) {
          triggerMouseEvent(evt.target, 'mouseup');
        }

        const offset = {
          x: x - dragInfo.position.x,
          y: y - dragInfo.position.y
        };

        const dragNodes = nodes.map((simNode, index) => {
          if ( simNode.id === dragInfo.nodeId ) {
            return ({
              ...simNode,
              x: simNode.x + offset.x,
              y: simNode.y + offset.y
            });
          }
          return ({
            ...simNode
          });
        });

        this.setState({
          nodes: dragNodes
        });

        dragInfo.position = {
          x,
          y
        };
      }
    };

    const onDragEnd = (evt) => {
      dragInfo = {
        dragging: false,
        nodeId: null,
        position: {}
      };
    };

    const renderedNodes = nodesData.map((n, index) => (
      <GraphNode
        key={index}
        data={n}
        index={index}
        onDragStart={onDragStart}
        onQuickActions={onQuickActions}
        connected={n.id !== 'consul'}
      />
    ));

    const renderedLinks = linksData.map((l, index) => (
      <GraphLink
        key={index}
        data={l}
        index={index}
      />
    ));

    return (
      <StyledSvg
        onMouseMove={onDragMove}
        onTouchMove={onDragMove}
        onMouseUp={onDragEnd}
        onTouchEnd={onDragEnd}
        onTouchCancel={onDragEnd}
        className='topology-svg'
      >
        <g>
          {renderedNodes}
        </g>
        <g>
          {renderedLinks}
        </g>
      </StyledSvg>
    );
  }
}

TopologyGraph.propTypes = {
  onQuickActions: React.PropTypes.func,
  services: React.PropTypes.array
};

export default Baseline(
  TopologyGraph
);
