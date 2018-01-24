const express = require("express");
const Card = require("./card.model");
const Deck = require("../deck/deck.model");

const promisify = require("es6-promisify");

async function getAllCards(req, res) {
  try {
    const deck = await Deck.findOne({ slug: req.params.slug });
    res.json(200).json(deck);
  } catch (error) {
    next(error);
  }
}

async function createCard(req, res, next) {
  try {
    const deck = await Deck.findOne({ slug: req.params.slug });
    const card = deck.cards.push({
      front: req.body.front,
      back: req.body.back,
    });
    await deck.save();
    const createdCard = deck.cards[deck.cards.length - 1];
    return res.status(201).json(createdCard);
  } catch (error) {
    next(error);
  }
}

async function getCardById(req, res, next) {
  try {
    // Find deck from slug and send back only the "cards" property
    const deck = await Deck.findOne({ slug: req.params.slug }, "cards");
    // Find card from id in params
    const fetchedCard = deck.cards.find(card => card.id === req.params.cardId);
    if (fetchedCard) {
      return res.status(200).json(fetchedCard);
    }
    res.json({ message: "This card no longer exists" });
  } catch (error) {
    next(error);
  }
}

// TODO work on updating a card
async function updateCardById(req, res, next) {
  try {
    // object that will hold the fields getting updated
    const updatedOpts = {}
    for(const key in req.body) {
      const val = req.body[key]
      updatedOpts[`cards.$.${key}`] = val
    }

    const updatedDeck = await Deck.findOneAndUpdate(
      { slug: req.params.slug, "cards._id": req.params.cardId },
      { $set: updatedOpts },
      { new: true },
    ).exec();
    const updatedCard = updatedDeck.cards.find(card => card.id === req.params.cardId);
    res.json(updatedCard);
  } catch (error) {
    next(error);
  }
}

async function deleteCardById(req, res, next) {
  try {
    const deck = await Deck.findOne({ slug: req.params.slug }, "cards");
    const fetchedCard = deck.cards.find(card => card.id === req.params.cardId);
    if (fetchedCard) {
      const removedCard = await fetchedCard.remove();
      await deck.save();
      return res.status(200).json(removedCard);
    }
    res.json({ message: "This card no longer exists" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCards,
  createCard,
  getCardById,
  deleteCardById,
  updateCardById,
};
