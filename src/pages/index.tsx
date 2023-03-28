import { GithubStar, Result, SearchInput } from "@/components";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [goSearch, setGoSearch] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Nametionalize - Predict Your Nationality by Your Name</title>
        <meta
          name="description"
          content="Have you ever wondered if your name could reveal something about nationality? Let's play a little game of prediction! Based on your name, what do you think your nationality might be?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="wrapper">
        <div className="min-h-[92vh] flex flex-col justify-between pt-4 pb-6">
          <div>
            <h1 className="text-[28px] font-bold text-white">Nametionalize</h1>
            <p className="text-sm text-white">
              Have you ever wondered if your name could reveal something about
              nationality? Let&#39;s play a little game of prediction!
            </p>
            <SearchInput
              name={name}
              setName={setName}
              setGoSearch={setGoSearch}
            />
            <Result name={name} goSearch={goSearch} setGoSearch={setGoSearch} />
          </div>
          <GithubStar />
        </div>
      </main>
    </>
  );
}
