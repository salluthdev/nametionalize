import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ResultType {
  country_id: string;
  probability: number;
}

export default function Home() {
  const [name, setName] = useState<string>("");
  const [result, setResult] = useState<Array<ResultType>>([]);
  const [countryId, setCountryId] = useState<string>("");
  const [flagUrl, setFlagUrl] = useState<string[]>([]);

  useEffect(() => {
    fetch(`https://api.nationalize.io?name=${name}`)
      .then((res) => res.json())
      .then(
        (data) => (
          setResult(data.country), setCountryId(data?.country[0]?.country_id)
        )
      );
  }, [name]);

  useEffect(() => {
    if (result.length > 0) {
      const countryIds = result.map((item) => item.country_id);
      Promise.all(
        countryIds.map((countryId) =>
          fetch(`https://countryflagsapi.com/png/${countryId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => res.blob())
        )
      ).then((blobs) =>
        setFlagUrl(blobs.map((blob) => URL.createObjectURL(blob)))
      );
    }
  }, [result]);

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
        <div className="py-4">
          <h1 className="text-2xl text-stone-800 mb-1">Nametionalize</h1>
          <p className="text-sm text-stone-800">
            Have you ever wondered if your name could reveal something about
            nationality? Yes, let's play a little game of prediction! Based on
            your name, what do you think your nationality might be?
          </p>
          <div className="h-10 flex items-center my-4">
            <input
              type="text"
              value={name.toUpperCase()}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-full text-sm font-bold text-stone-800 border border-stone-400 outline-none rounded-sm py-1 px-2"
            />
            <button className="h-full font-bold text-white bg-stone-800 px-6">
              Go!
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {result.map((item, index) => (
              <div key={item.country_id}>
                <p className="text-sm text-stone-800">
                  Country: {item.country_id}
                </p>
                <img src={flagUrl[index]} alt="flag" className="w-12" />
                <p className="text-sm text-stone-800">
                  Probability: {item.probability}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
