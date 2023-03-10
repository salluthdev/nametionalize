import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface ResultType {
  country_id: string;
  probability: number;
}

export default function Home() {
  const [name, setName] = useState<string>("");
  const [result, setResult] = useState<Array<ResultType>>([]);
  const [countryId, setCountryId] = useState<string>("");
  const [flagUrl, setFlagUrl] = useState<string[]>([]);
  const [goSearch, setGoSearch] = useState<boolean>(false);
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);

  useEffect(() => {
    setGoSearch(false);
    fetch(`https://api.nationalize.io?name=${name}`)
      .then((res) => res.json())
      .then((data) => {
        const fixedResult = data.country?.map((country: any) => {
          if (country.country_id === "SQ") {
            return { ...country, country_id: "SG" };
          } else {
            return country;
          }
        });
        setResult(fixedResult);
        if (fixedResult?.length > 0) {
          setCountryId(fixedResult[0]?.country_id);
        }
      });
  }, [goSearch]);

  const regionName = (countryId: string) => {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(countryId);
  };

  const flagsUrl = useMemo(() => {
    return result?.map(
      (item) => `https://countryflagsapi.com/png/${item.country_id}`
    );
  }, [result]);

  useEffect(() => {
    if (result?.length > 0) {
      setLoadingFlag(true);
      Promise.all(
        flagsUrl.map((flagUrl) =>
          fetch(flagUrl, {
            method: "GET",
            headers: {
              "Content-Type": "image/png",
            },
          }).then((res) => res.blob())
        )
      )
        .then((blobs) =>
          setFlagUrl(blobs.map((blob) => URL.createObjectURL(blob)))
        )
        .finally(() => setLoadingFlag(false));
    }
  }, [result, flagsUrl]);

  function cleanNumber(e: any) {
    return Number.parseFloat(e).toFixed(2);
  }

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
      <main className="wrapper min-h-screen bg-slate-200">
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
              placeholder="NAME"
              value={name.toUpperCase()}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-full text-sm font-bold text-stone-800 border border-stone-400 outline-none rounded-sm py-1 px-2"
            />
            <button
              className="h-full font-bold text-white bg-stone-800 px-6"
              onClick={() => setGoSearch(true)}
            >
              Go!
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {result &&
              result.map((item, index) => (
                <div key={item.country_id}>
                  <h4 className="text-sm font-bold text-stone-800">
                    {regionName(item.country_id)}
                  </h4>
                  {loadingFlag ? (
                    <div className="w-10 h-5 bg-stone-200"></div>
                  ) : (
                    <div className="w-10 h-6 relative">
                      <Image
                        src={flagUrl[index]}
                        fill
                        object-fit="cover"
                        alt="flag"
                      />
                    </div>
                  )}
                  <p className="text-sm text-stone-800">
                    Probability: {cleanNumber(item.probability * 100)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
