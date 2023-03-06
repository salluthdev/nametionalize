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
        <h1 className="text-stone-800">
          Nametionalize - Predict your nationality by your name
        </h1>
        <input
          type="text"
          value={name}
          className="border border-stone-800 outline-none"
          onChange={(e) => setName(e.target.value)}
        />
        {result.map((item) => (
          <div key={item.country_id}>
            <p>{item.country_id}</p>
            <p>{item.probability}</p>
          </div>
        ))}
      </main>
    </>
  );
}
