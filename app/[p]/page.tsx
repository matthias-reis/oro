"use client";
import {
  Card,
  CardComp,
  CardCompS,
  Col,
  Val,
  getMixedStack,
  initialStack,
} from "@/core/card";
import { Player, PlayerComp } from "@/core/player";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useReducer, useState } from "react";

const cardNumbers = {
  2: [6, 16, 0],
  3: [6, 10, 2],
  4: [6, 8, 0],
  5: [4, 6, 2],
  6: [4, 5, 2],
} as const;

// 2 Players
// 6 cards + 10 cards
export default function Page() {
  const { p } = useParams() as { p: string };
  const [trump, setTrump] = useState<Card | null>(null);
  const [activePlayer, setActivePlayer] = useState<number>(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [changeCards, setChangeCards] = useState<Card[]>([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const playerNumber = parseInt(p);

  const [openCardCount, allCardCount, changeCardCount] =
    cardNumbers[playerNumber as keyof typeof cardNumbers];

  if (isNaN(playerNumber)) {
    notFound();
  }

  useEffect(() => {
    const cards = getMixedStack();

    setPlayers(
      Array(playerNumber)
        .fill(0)
        .map(
          (_, i) =>
            new Player(
              `Player ${i + 1}`,
              [
                ...cards.slice(
                  i * allCardCount,
                  i * allCardCount + openCardCount
                ),
                ...(i === 0 && changeCardCount ? cards.slice(-2) : []),
              ],
              cards.slice(
                i * allCardCount + openCardCount,
                (i + 1) * allCardCount
              )
            )
        )
    );
    setChangeCards(cards.slice(-changeCardCount));
  }, [allCardCount, changeCardCount, openCardCount, playerNumber, setPlayers]);

  const nextPlayer = () => {
    const next = (activePlayer % playerNumber) + 1;
    setActivePlayer(next);
  };

  let scoreA = players[0]?.getScore() ?? 0;
  if (playerNumber === 4) {
    scoreA += players[2]?.getScore() ?? 0;
  }
  if (playerNumber === 6) {
    scoreA += players[3]?.getScore() ?? 0;
  }

  let scoreB = players[1]?.getScore() ?? 0;
  if (playerNumber === 4) {
    scoreB += players[3]?.getScore() ?? 0;
  }
  if (playerNumber === 6) {
    scoreB += players[2]?.getScore() ?? 0;
    scoreB += players[4]?.getScore() ?? 0;
    scoreB += players[5]?.getScore() ?? 0;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-6xl mt-8 mb-6 text-bold">
        ORO - {playerNumber} Players
      </h1>
      <ul className="inline-grid grid-cols-8 gap-1">
        {initialStack.map((card) => (
          <li
            key={card.toString()}
            className={`${trump && card !== trump && "opacity-30"}`}
          >
            <button
              onClick={() => {
                setTrump(card);
                if (players[0].stack.length === openCardCount) {
                  nextPlayer();
                }
              }}
            >
              <CardCompS card={card} />
            </button>
          </li>
        ))}
      </ul>
      <div className="text-5xl text-bold mt-5 opacity-30">
        {scoreA} : {scoreB}
      </div>
      <div className="flex gap-4 flex-col p-5">
        {players.map((player, i) => {
          let solo = false;
          if (i === 0) {
            solo = true;
          }
          if (playerNumber === 4 && i === 2) {
            solo = true;
          }
          if (playerNumber === 6 && i === 3) {
            solo = true;
          }
          return (
            <PlayerComp
              key={i}
              player={player}
              active={activePlayer === i + 1}
              trump={trump}
              solo={solo}
              clickCard={(card: Card) => {
                if (player.stack.length > openCardCount) {
                  player.stackCard(card);
                  if (player.stack.length === openCardCount) {
                    nextPlayer();
                  }
                } else {
                  player.playCard(card);
                  nextPlayer();
                }
                forceUpdate();
              }}
              clickWin={() => {
                const cards = players.map((p) => p.currentCard!);
                // all cards go to the winner
                player.winCards(cards);
                // everyone draws a card
                players.forEach((p) => p.drawCard());
                // winner is also the next in line
                setActivePlayer(i + 1);
                // and the current cards are reset
                players.forEach((p) => (p.currentCard = null));

                forceUpdate();
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
