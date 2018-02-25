const express = require("express");
const mongoose = require("mongoose");

const Deck = require("./deck.model");
const User = require("../user/user.model");

const slugify = require("slugify");

async function getAllUserDecks(req, res, next) {
  try {
    // const decks = await Deck.find({ user: req.user._id }).populate("user");
    const user = await User.findOne({ email: req.user.email }).populate(
      "decks",
    );
    if (user) return res.json(user.decks);
    res.json({ message: "There are currently no decks" });
  } catch (error) {
    next(error);
  }
}

async function getAllDecks(req, res, next) {
  try {
    const decks = await Deck.find();
    if (decks) return res.json(decks);
    res.json({ message: "There are currently no decks" });
  } catch (error) {
    next(error);
  }
}

async function getDeckBySlug(req, res, next) {
  try {
    const deck = await Deck.findOne({ slug: req.params.slug });
    if (deck) return res.json(deck);
    res.json({ message: "This deck does not exist" });
  } catch (error) {
    next(error);
  }
}

async function createDeck(req, res, next) {
  try {
    const deck = new Deck({ name: req.body.name });
    const user = await User.findOne({ email: req.user.email });
    user.decks.push(mongoose.Types.ObjectId(deck._id));
    await deck.save();
    await user.save();
    res.status(201).json(deck);
  } catch (error) {
    next(error);
  }
}

async function updateDeckBySlug(req, res, next) {
  try {
    const updatedDeck = await Deck.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: { name: req.body.name, slug: slugify(req.body.name) } },
      { new: true },
    ).exec();
    res.status(200).json(updatedDeck);
  } catch (error) {
    next(error);
  }
}

async function deleteDeckById(req, res, next) {
  try {
    const removedDeck = await Deck.findByIdAndRemove(req.params.id);
    const newArr = await removeDeckIdFromUserDecksArray(
      req.user,
      req.params.id,
    );
    res.status(200).json(removedDeck);
  } catch (error) {
    next(error);
  }
}

// Helper Function to Remove deck id ref from user decks array
async function removeDeckIdFromUserDecksArray(currentUser, deckId) {
  const user = await User.findOne({ email: currentUser.email });
  const decks = user.decks;
  const indexOfRemovedDeckFromUser = decks.indexOf(deckId);
  const userWithRemovedDeck = decks.splice(indexOfRemovedDeckFromUser, 1);
  user.save();
  return userWithRemovedDeck;
}

module.exports = {
  getAllUserDecks,
  getAllDecks,
  createDeck,
  getDeckBySlug,
  deleteDeckById,
  updateDeckBySlug,
};
