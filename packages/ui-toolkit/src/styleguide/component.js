import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import remcalc from 'remcalc';
import { P, H3 } from '../';

const chevron =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOSIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgOSA2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTsiIGNsYXNzPSJiYXNlbGluZS1idFRncEsgaGltUHhaIj48cGF0aCBmaWxsPSJyZ2JhKDczLCA3MywgNzMsIDEpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05IDEuMzg2TDcuNjQ4IDAgNC41IDMuMjI4IDEuMzUyIDAgMCAxLjM4NiA0LjUgNnoiPjwvcGF0aD48L3N2Zz4=';

const Main = styled.div`
  h4[class*='rsg--heading'] {
    line-height: ${remcalc(26)};
    font-size: ${remcalc(21)};
  }
`;

const fadeIn = keyframes`
   from {opacity: 0;}
   to {opacity: 1;}
`;

const Wrapper = styled.div`
  > div {
    padding: ${remcalc(16)};
    animation: ${fadeIn} 250ms ease-in-out;
    background: ${props => props.theme.whiteHover};

    th[class*='rsg--cellHeading-'] {
      font-weight: normal;
      padding-bottom: ${remcalc(16)};
    }

    thead[class*='rsg--tableHead'] {
      border: none;
    }
  }
`;

const Props = styled.div`
  > div:not(:empty) {
    position: relative;
    border-bottom: ${remcalc(1)} solid ${props => props.theme.grey};
  }

  button[class*='rsg--isActive-'] {
    border: none;
  }

  button {
    text-transform: none;
    color: ${props => props.theme.text};
    position: relative;
    cursor: pointer;

    &:after {
      content: '';
      position: absolute;
      display: block;
      width: ${remcalc(9)};
      height: ${remcalc(6)};
      background: url(${chevron});
      right: ${remcalc(-18)};
      top: ${remcalc(15)};
    }

    &:hover {
      color: ${props => props.theme.text};
    }
  }
`;

const Content = styled.div;

export default ({
  name,
  heading,
  description,
  examples,
  tabButtons,
  tabBody
}) => {
  return (
    <Fragment>
      <header>
        <H3 white>{heading.props.children}</H3>
        {description &&
          description.props && <P white>{description.props.text}</P>}
      </header>
      <Main>
        <Props>{tabButtons}</Props>
        <Wrapper>{tabBody}</Wrapper>
        <Content>{examples}</Content>
      </Main>
    </Fragment>
  );
};
