interface SearchInputProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setGoSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchInput({
  name,
  setName,
  setGoSearch,
}: SearchInputProps) {
  return (
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
  );
}
