import Image from "next/image";
import { Error } from ".";
import { useEffect, useMemo, useState } from "react";

interface ResultProps {
  name: string;
  goSearch: boolean;
  setGoSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ResultType {
  country_id: string;
  probability: number;
}

export default function Result({ name, goSearch, setGoSearch }: ResultProps) {
  const [result, setResult] = useState<Array<ResultType>>([]);
  const [countryId, setCountryId] = useState<string>("");
  const [flagUrl, setFlagUrl] = useState<string[]>([]);
  const [loadingFlag, setLoadingFlag] = useState<boolean>(false);
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);
  const [noData, setNoData] = useState<boolean>(false);
  const [APILimited, setAPILimited] = useState<boolean>(false);

  // fetch the country id and probability
  useEffect(() => {
    setGoSearch(false);
    setResult([]);
    if (name) {
      fetch(`https://api.nationalize.io?name=${name}`)
        .then((res) => {
          if (res.status === 429) {
            setAPILimited(true);
          } else {
            return res.json();
          }
        })
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
            setNoData(false);
          } else {
            setNoData(true);
          }
        });
    }
  }, [goSearch]);

  // display the region name from country id
  const regionName = useMemo(() => {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return (countryId: string) => regionNames.of(countryId);
  }, [countryId]);

  // fetch the flag images from country id
  const flagsUrl = useMemo(() => {
    return result?.map(
      (item) => `https://flagcdn.com/w160/${item.country_id.toLowerCase()}.png`
    );
  }, [result]);

  useEffect(() => {
    if (result?.length > 0) {
      setLoadingFlag(true);
      Promise.all(
        flagsUrl.map((flagUrl) => fetch(flagUrl).then((res) => res.blob()))
      )
        .then((blobs) =>
          setFlagUrl(blobs.map((blob) => URL.createObjectURL(blob)))
        )
        .finally(() => setLoadingFlag(false));
    }
  }, [result]);

  // reset the no data component if user change the name
  useEffect(() => {
    setNoData(false);
  }, [name]);

  // reset animation in every result
  useEffect(() => {
    setPlayAnimation(true);
    setTimeout(() => {
      setPlayAnimation(false);
    }, 800);
  }, [result]);

  // set the max number after comma is two
  function cleanNumber(e: any) {
    return Number.parseFloat(e).toFixed(2);
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      {result.length !== 0 ? (
        result.map((item, index) => (
          <div key={item.country_id}>
            <div className="flex items-center gap-1 bg-stone-800 mb-1">
              <h4 className="text-base font-bold text-white">
                {regionName(item.country_id)}
              </h4>
              <>
                {loadingFlag ? (
                  <div className="w-7 h-4 bg-stone-200 rounded-sm" />
                ) : (
                  flagUrl.length > 0 && (
                    <div className="w-7 h-4 relative">
                      <Image
                        src={flagUrl[index]}
                        fill
                        object-fit="cover"
                        alt="flag"
                        className="rounded-sm"
                      />
                    </div>
                  )
                )}
              </>
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
                    playAnimation ? "animate-[progressBar_0.8s_forwards]" : ""
                  }`}
                  onAnimationEnd={() => setPlayAnimation(false)}
                ></div>
              </div>
              <p className="text-sm text-white">
                {cleanNumber(item.probability * 100)}%
              </p>
            </div>
          </div>
        ))
      ) : (
        <>
          {APILimited ? (
            <Error text="Oops, server request limit reached today!" />
          ) : name !== "" && noData == true ? (
            <Error text="Hmm.. is that your real name?" />
          ) : (
            <div className="relative w-10 h-10">
              <Image
                src={"/svg/arrow.svg"}
                fill
                object-fit="cover"
                alt="arrow"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
