import Layout from "../layouts/Layout";

const Home: React.FC = () => {
  return (
    <>
      <Layout>
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
                <img
                  alt=""
                  src="https://japanpowered.com/media/images/manga-boy-reading.jpg"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="lg:py-24">
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Discover Your Next Great Read
                </h2>

                <p className="mt-4 text-gray-600">
                  Novelicious learns your reading preferences and provides
                  tailored book recommendations just for you. Discover new
                  titles that align with your interests and taste, expanding
                  your literary horizons.
                </p>

                <a
                  href="/market"
                  className="mt-8 inline-block rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
                >
                  Get Started.
                </a>

                <p className=" mt-44">coming soon.</p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Home;
