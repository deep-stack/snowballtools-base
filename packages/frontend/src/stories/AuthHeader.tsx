interface HeaderProps {}

export const Header = ({}: HeaderProps) => (
  <div className="py-8 relative z-10">
    <div className="flex justify-center items-center gap-2.5">
      <img src="/logo.svg" alt="snowball logo" className="h-10 rounded-xl" />
      <div className="text-sky-950 text-2xl font-semibold font-display leading-loose">
        Snowball
      </div>
    </div>
  </div>
);
