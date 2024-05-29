import Layout from "../layouts/Layout";

const Home: React.FC = () => {
  return (
    <>
      <Layout>
        <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 sm:items-center">
          <div className="p-8 md:p-12 lg:px-16 lg:py-24">
            <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Find your favorite book on this platform.
              </h2>
              <p className="hidden text-gray-500 md:mt-4 md:block">
                You’re in the right place. Tell us what titles or genres you’ve
                enjoyed in the past, and we’ll give you surprisingly insightful
                recommendations.
              </p>
              <div className="mt-4 md:mt-8">
                <a
                  href="/market"
                  className="inline-block rounded bg-blue-700 hover:bg-primary-700 px-12 py-3 text-sm font-medium text-white transition focus:ring-4 focus:outline-none focus:ring-primary-300"
                >
                  Get Started Today
                </a>
              </div>
            </div>
          </div>
          <img
            alt=""
            src="https://i.pinimg.com/1200x/d4/9e/4f/d49e4fbcdd2adcc305aa917df36021b7.jpg"
            className="max-h-screen object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_4rem)] md:rounded-ss-[60px]"
          />
        </section>
      </Layout>
    </>
  );
};

export default Home;
