import { CardComp, getMixedStack } from "@/core/card";
import { Player } from "@/core/player";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>ORO - Game Evaluation</h1>
      <p>
        <Link href="/2">2 players</Link>
      </p>
      <p>
        <Link href="/3">3 players</Link>
      </p>
      <p>
        <Link href="/4">4 players</Link>
      </p>
      <p>
        <Link href="/5">5 players</Link>
      </p>
      <p>
        <Link href="/6">6 players</Link>
      </p>
    </div>
  );
}
