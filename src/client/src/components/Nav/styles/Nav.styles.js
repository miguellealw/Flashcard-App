import styled from 'styled-components';
import { neonGreen } from '../../../global.styles';

export const Navigation = styled.nav`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 5.5rem;
  font-size: 0.7em;
  // background: #ebebeb;
  //  background: #202226;
  
  }
`;

export const NavList = styled.ul`
    display: flex;
    align-items: center;

    .selected {
      // color: ${neonGreen};
      text-decoration: underline;
    }

    a {
      text-decoration: none;
      color: black;
      text-transform: uppercase;
      font-weight: 700;
      // letter-spacing: 0.15em;
      margin-right: 4rem;
      &:hover {
        text-decoration: underline;
      }

      li {
        list-style: none;
      }
`;
