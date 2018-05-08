import styled from 'styled-components';
import remcalc from 'remcalc';

export default styled.div`
  width: calc(100% + ${remcalc(36)});
  border-top: ${remcalc(1)} solid ${props => props.theme.grey};
`;
