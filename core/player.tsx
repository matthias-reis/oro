"use client";
import { FC } from "react";
import { Card, CardComp } from "./card";

export class Player {
  name: string;
  currentCard: Card | null = null;
  stack: Card[] = [];
  hiddenStack: Card[] = [];
  won: Card[] = [];
  constructor(name: string, stack: Card[], hiddenStack: Card[]) {
    this.name = name;
    this.stack = stack;
    this.hiddenStack = hiddenStack;
  }
  stackCard(card: Card) {
    this.winCards([card]);
    this.stack = this.stack.filter((c) => c !== card);
  }
  playCard(card: Card) {
    this.currentCard = card;
    this.stack = this.stack.filter((c) => c !== card);
  }
  drawCard() {
    const card = this.hiddenStack.pop();
    if (card) {
      this.stack.push(card);
    }
  }
  winCards(cards: Card[]) {
    this.won.push(...cards);
  }
  getScore() {
    return this.won.reduce((acc, card) => acc + (card ? card.weight : 0), 0);
  }
}

export const PlayerComp: FC<{
  player: Player;
  active?: boolean;
  trump: Card | null;
  solo?: boolean;
  clickCard: (card: Card) => void;
  clickWin: () => void;
}> = ({ player, active, clickCard, clickWin, trump, solo }) => {
  const teamClass = {
    1: "border-gray-600",
    2: "border-gray-300",
  };
  return (
    <div
      className={`border rounded-lg flex flex-row gap-4 p-6 items-center ${
        active && "bg-gray-900"
      } ${solo ? "border-gray-300" : "border-gray-700"} `}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <div>{player.name}</div>
        <div className="text-2xl opacity-30">{player.getScore()}</div>
      </div>
      <div>{player.hiddenStack.length}</div>
      <div className={`grid gap-2 grid-cols-6 ${!active && "opacity-10"}`}>
        {player.stack
          .sort((a, b) => a.sorter() - b.sorter())
          .map((card) => (
            <button
              key={card.toString()}
              onClick={() => {
                clickCard(card);
              }}
            >
              <CardComp card={card} trump={trump} />
            </button>
          ))}
      </div>
      <div className="w-32 mx-4">
        {player.currentCard && (
          <CardComp card={player.currentCard} trump={trump} />
        )}
      </div>
      <button
        className="px-4 py-2 rounded bg-slate-400 text-slate-800"
        onClick={() => {
          clickWin();
        }}
      >
        Win
      </button>
    </div>
  );
};
