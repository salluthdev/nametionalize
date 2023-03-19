import Image from "next/image";

interface ErrorProps {
  text: string;
}

export default function Prevent({ text }: ErrorProps) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center mt-6">
      <div className="relative w-20 h-20">
        <Image
          src={"/img/thinking-emoji.png"}
          fill
          object-fit="cover"
          sizes="100%"
          alt="no data"
        />
      </div>
      <p className="text-sm text-white">{text}</p>
    </div>
  );
}
