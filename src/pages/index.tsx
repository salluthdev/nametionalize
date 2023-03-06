import Head from "next/head";
import { useEffect, useState } from "react";

interface ResultType {
  country_id: string;
  probability: number;
}

export default function Home() {
  const [name, setName] = useState<string>("");
  const [result, setResult] = useState<Array<ResultType>>([]);

  useEffect(() => {
    fetch("https://api.nationalize.io?name=" + name)
      .then((res) => res.json())
      .then((data) => setResult(data.country));
  }, [name]);

  return (
    <>
      <Head>
        <title>Nametionalize - Predict your nationality by your name</title>
        <meta
          name="description"
          content="Have you ever wondered if your name could reveal something about nationality? Yes, let's play a little game of prediction! Based on your name, what do you think your nationality might be?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="wrapper">
        <h1 className="text-2xl text-stone-800 mt-4">Nametionalize</h1>
        <p className="text-sm text-stone-800">
          Have you ever wondered if your name could reveal something about
          nationality? Yes, let's play a little game of prediction! Based on
          your name, what do you think your nationality might be?
        </p>
        <input
          type="text"
          value={name.toUpperCase()}
          onChange={(e) => setName(e.target.value)}
          className="w-full text-sm font-bold text-stone-800 border border-stone-400 outline-none rounded-sm py-1 px-2 my-4"
        />
        <div className="flex flex-col gap-2">
          {result.map((item) => (
            <div key={item.country_id}>
              <p className="text-sm text-stone-800">
                Country: {item.country_id}
              </p>
              <p className="text-sm text-stone-800">
                Probability: {item.probability}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
