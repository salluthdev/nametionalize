import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [playAnimation, setPlayAnimation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPlayAnimation(true);
    setTimeout(() => {
      setPlayAnimation(false);
    }, 800);
  }, [result]);

  useEffect(() => {
    setGoSearch(false);
    setResult([]);
    fetch(`https://api.nationalize.io?name=${name}`)
      .then((res) => res.json())
      .then((data) => {
        const fixedResult = data.country
          ?.map((country: any) => {
            if (country.country_id === "SQ") {
              return { ...country, country_id: "SG" };
            } else {
              return country;
            }
          })
          .filter((country: any) => country.probability >= 0.005);
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
      <main className="wrapper min-h-screen bg-stone-800">
        <div className="py-4">
          <h1 className="text-[28px] text-white">Nametionalize</h1>
          <p className="text-sm text-white">
            Have you ever wondered if your name could reveal something about
            nationality? Yes, let&#39;s play a little game of prediction! Based
            on your name, what do you think your nationality might be?
          </p>
          <div className="h-10 flex items-center my-4">
            <input
              type="text"
              placeholder="NAME"
              value={name.toUpperCase()}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
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
          <div className="flex flex-col gap-4 mt-4">
            {result &&
              result.map((item, index) => (
                <div key={item.country_id}>
                  <div className="flex items-center gap-1 bg-stone-800 mb-1">
                    <h4 className="text-base font-bold text-white">
                      {regionName(item.country_id)}
                    </h4>
                    {loadingFlag ? (
                      <div className="w-7 h-4 bg-stone-200 rounded-sm"></div>
                    ) : (
                      <div className="w-7 h-4 relative">
                        <Image
                          src={flagUrl[index]}
                          fill
                          object-fit="cover"
                          alt="flag"
                          className="rounded-sm"
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <div
                      className="h-7"
                      style={{
                        width: `${Math.round(item.probability * 100)}%`,
                      }}
                    >
                      <div
                        className={`h-full bg-green-400 rounded-sm ${
                          playAnimation
                            ? "animate-[progressBar_0.8s_forwards]"
                            : ""
                        }`}
                        onAnimationEnd={() => setPlayAnimation(false)}
                      ></div>
                    </div>
                    <p className="text-sm text-white">
                      {cleanNumber(item.probability * 100)}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
