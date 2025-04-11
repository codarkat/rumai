export function Background() {
  return (
    <>
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,transparent)] opacity-25"></div>
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-sky-400"></div>
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-[10%] w-96 h-96 bg-sky-300/20 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>
    </>
  );
}
