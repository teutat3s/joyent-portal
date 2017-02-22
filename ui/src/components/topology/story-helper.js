const React = require('react');
const Styled = require('styled-components');
const composers = require('../../shared/composers');
const fns = require('../../shared/functions');
const Input = require('../form/input');
const Select = require('../form/select');
const Topology = require('./');
const data = require('./data');

const {
  default: styled
} = Styled;

const {
  rndId
} = fns;

const {
  Baseline
} = composers;

const {
  TopologyGraph
} = Topology;

const StyledForm = styled.form`
  display: flex;
  flex-direction: row;
  margin: 5px;
`;

class StoryHelper extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      data: data
    };
  }

  render() {

    const data = this.state.data;

    const linkOptions = (nodes) => {
      return nodes.map((node, index) => (
        <option key={node.id} value={node.id}>{node.id}</option>
      ));
    };

    const onAddService = (evt) => {
      evt.preventDefault();

      const service = evt.target.service.value;
      const target = evt.target.target.value;
      const source = evt.target.source.value;

      const node = {
        ...data[0],
        id: rndId(),
        uuid: rndId(),
        name: service
      };

      delete node.connections;

      if(target) {
        node.connections = [
          data.reduce((acc, s, i) => s.id === target ? s.uuid : acc, '')
        ];
      }

      const d = this.state.data.map((data, index) => {

        if(data.id === source) {
          const connections = data.connections ?
            data.connections.concat(node.uuid) : [node.uuid];

          return ({
            ...data,
            connections: connections
          });
        }

        return ({
          ...data
        });
      });

      d.push(node);

      this.setState({
        data: d
      });
    };

    return (
      <div>
        {<StyledForm onSubmit={onAddService}>
          <Input name='service' placeholder='Service name' />
          <Select name='target'>
            <option value=''>Select a service to link to (optional)</option>
            {linkOptions(data)}
          </Select>
          <Select name='source'>
            <option value=''>Select a service to link from (optional)</option>
            {linkOptions(data)}
          </Select>
          <Input name='Add service' type='submit' />
        </StyledForm>}
        <TopologyGraph services={data} />
      </div>
    );
  }
}

module.exports = Baseline(
  StoryHelper
);
