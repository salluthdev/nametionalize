import { GithubStar, Result } from "@/components";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [goSearch, setGoSearch] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Nametionalize - Predict your nationality by your name</title>
        <meta
          name="description"
          content="Have you ever wondered if your name could reveal something about nationality? Let's play a little game of prediction! Based on your name, what do you think your nationality might be?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="wrapper bg-stone-800">
        <div className="min-h-[92vh] flex flex-col justify-between pt-4 pb-6">
          <div>
            <h1 className="text-[28px] font-bold text-white">Nametionalize</h1>
            <p className="text-sm text-white">
              Have you ever wondered if your name could reveal something about
              nationality? Let&#39;s play a little game of prediction!
            </p>
            <div className="h-10 flex items-center my-4">
              <input
                type="text"
                placeholder="NAME"
                value={name.toUpperCase()}
                onChange={(e) => setName(e.target.value.replaceAll(" ", ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setGoSearch(true);
                  }
                }}
                className="w-full h-full text-sm font-bold text-stone-800 rounded-l-sm outline-none py-1 px-2"
              />
              <button
                className="h-full font-bold text-white bg-stone-500 rounded-r-sm px-6 hover:bg-stone-600"
                onClick={() => setGoSearch(true)}
              >
                Go!
              </button>
            </div>
            <Result name={name} goSearch={goSearch} setGoSearch={setGoSearch} />
          </div>
          <GithubStar />
        </div>
      </main>
    </>
  );
}
