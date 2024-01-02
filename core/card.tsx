"use client";
import { FC } from "react";

export type Val = "7" | "8" | "9" | "10" | "B" | "D" | "K" | "A";
export type Col = "♣️" | "♠️" | "♥️" | "♦️";
export type CardType = [Val, Col];

const valWeights = {
  "7": 1,
  "8": 2,
  "9": 3,
  "10": 4,
  B: 5,
  D: 6,
  K: 7,
  A: 8,
};

const colWeights = {
  "♣️": 40,
  "♠️": 30,
  "♥️": 20,
  "♦️": 10,
};

export class Card {
  val: Val;
  col: Col;
  weight: 1 | 2 | 3;

  constructor(val: Val, col: Col, weight: 1 | 2 | 3) {
    this.val = val;
    this.col = col;
    this.weight = weight;
  }

  toString() {
    return `${this.val}${this.col}`;
  }

  getColor() {
    switch (this.col) {
      case "♠️":
        return "#7FCC9E";
      case "♣️":
        return "#8CA4CC";
      case "♥️":
        return "#CC8A8A";
      case "♦️":
        return "#CCBC87";
    }
  }

  getCardType(): CardType {
    return [this.val, this.col];
  }

  sorter() {
    return valWeights[this.val] + colWeights[this.col];
  }
}

export const CardComp: FC<{ card: Card; trump: Card | null }> = ({
  card,
  trump,
}) => {
  const isTrump = trump && (card.col === trump.col || card.val === trump.val);
  return (
    <div
      className={`text-lg flex border p-1 rounded-md gap-2 items-center justify-center w-16 h-12 ${
        isTrump && "border-b-4"
      } ${card.weight === 3 && "bg-slate-700"}`}
      style={{ color: card.getColor() }}
    >
      <div className="text-4xl mb-3">{card.col}</div>
      <div>{card.val}</div>
    </div>
  );
};

export const CardCompS: FC<{ card: Card }> = ({ card }) => (
  <div
    className={`text-lg flex border p-1 rounded-md gap-1 items-center justify-center w-12 h-10 ${
      card.weight === 3 && "bg-slate-700"
    }`}
    style={{ color: card.getColor() }}
  >
    <div className="text-3xl mb-2">{card.col}</div>
    <div className="text-md">{card.val}</div>
  </div>
);

export const initialStack: Card[] = [
  new Card("7", "♦️", 3),
  new Card("8", "♦️", 1),
  new Card("9", "♦️", 1),
  new Card("10", "♦️", 1),
  new Card("B", "♦️", 2),
  new Card("D", "♦️", 2),
  new Card("K", "♦️", 2),
  new Card("A", "♦️", 2),
  new Card("7", "♥️", 1),
  new Card("8", "♥️", 1),
  new Card("9", "♥️", 1),
  new Card("10", "♥️", 1),
  new Card("B", "♥️", 2),
  new Card("D", "♥️", 2),
  new Card("K", "♥️", 2),
  new Card("A", "♥️", 2),
  new Card("7", "♣️", 1),
  new Card("8", "♣️", 1),
  new Card("9", "♣️", 1),
  new Card("10", "♣️", 1),
  new Card("B", "♣️", 2),
  new Card("D", "♣️", 2),
  new Card("K", "♣️", 2),
  new Card("A", "♣️", 2),
  new Card("7", "♠️", 1),
  new Card("8", "♠️", 1),
  new Card("9", "♠️", 1),
  new Card("10", "♠️", 1),
  new Card("B", "♠️", 2),
  new Card("D", "♠️", 2),
  new Card("K", "♠️", 2),
  new Card("A", "♠️", 2),
];

export function getMixedStack() {
  return [...initialStack].sort(() => Math.random() - 0.5);
}
