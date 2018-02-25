/* Component */
import React from "react";
import { DeckInfo, DeckContainer } from "./styles/Deck.styles";

const Deck = ({ name, cardAmount, imgUrl, match }) => {
  return (
    <DeckContainer>
      {/* <DeckImg>
        <img src={imgUrl} alt="Deck Img" />
      </DeckImg> */}
      <DeckInfo>
        <h3>{name}</h3>
        {/* <p>{match.params.deckName}</p> */}
        <p>{cardAmount} Cards</p>
      </DeckInfo>
    </DeckContainer>
  );
};

export default Deck;