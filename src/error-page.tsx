const ErrorPage: React.FC = () => {
  return (
    <>
      {/*
    Graphic from https://www.opendoodles.com/
*/}

      <div className="grid h-screen place-content-center bg-white px-4">
        <div className="text-center">
          <img
            src="https://i.pinimg.com/originals/1b/c1/4c/1bc14c13a97bb6879413c2e3c55cd24b.png"
            className="mx-auto h-56 w-auto text-black sm:h-64"
          />

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Uh-oh!
          </h1>

          <p className="mt-4 text-gray-500">We can't find that page.</p>

          <a
            className="mt-2 group relative inline-block text-sm font-medium text-slate-600 focus:outline-none focus:ring active:text-slate-500"
            href="/"
          >
            <span className="absolute inset-0 border border-current"></span>
            <span className="block border border-current bg-white px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
              Back
            </span>
          </a>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
