import Image from "next/image";
import { useEffect, useState } from "react";

export default function GithubStar() {
  const [githubStars, setGithubStars] = useState<number>(0);

  // counting github's stars
  useEffect(() => {
    fetch("https://api.github.com/repos/salluthdev/nametionalize")
      .then((res) => res.json())
      .then((data) => setGithubStars(data.stargazers_count));
  }, []);

  return (
    <a
      href="https://github.com/salluthdev/nametionalize"
      target="_blank"
      className="text-sm hover:underline text-white mt-4"
    >
      <div className="flex items-center gap-1">
        <div className="relative w-4 h-4">
          <Image src={"/svg/star.svg"} fill object-fit="cover" alt="star" />
        </div>
        <span className="font-bold">{githubStars}</span> on
        <span className="font-bold">Github</span>, and still counting..
      </div>
    </a>
  );
}
