import Layout from "../layouts/Layout";

const Home: React.FC = () => {
  return (
    <>
      <Layout>
        <section className="bg-gray-50">
          <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
            <div className="mx-auto max-w-xl text-center">
              <h1 className="text-3xl font-extrabold sm:text-5xl">
                <strong className="font-extrabold text-blue-600 sm:block">
                  {" "}
                  novelicious{" "}
                </strong>
              </h1>

              <p className="mt-4 sm:text-xl/relaxed">
                {" "}
                Tell us what titles or genres you’ve enjoyed in the past, and
                we’ll give you surprisingly insightful recommendations.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  className="block w-full rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                  href="/market"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Home;
