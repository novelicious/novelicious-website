import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
interface RecommendationData {
  id: number;
  image: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string[];
  cost: number;
}

const Recommendation: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const userId = sessionStorage.getItem("user_id");
      const token = sessionStorage.getItem("token");

      if (!userId || !token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/recommend/${userId}?topK=8`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.recommendations && Array.isArray(data.recommendations)) {
            setRecommendations(data.recommendations);
            console.log(data.recommendations);
          } else {
            setError("Unexpected response format");
          }
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to fetch recommendations.");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (recommendations.length === 0) {
      fetchRecommendations();
    }
  }, [recommendations]);

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
        <Navbar />
        <h1 className=" text-lg font-semibold underline">
          Our Recommendations 🫣
        </h1>
        {loading ? (
          <>
            <div className="text-center mt-8">
              <div className="flex justify-center items-center h-96">
                <div
                  className="spinner-border border-primary animate-spin inline-block w-8 h-8 border-4 rounded-full"
                  role="status"
                >
                  <span className="visually-hidden">🥸</span>
                </div>
              </div>
            </div>
          </>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul
            data-aos-anchor-placement="center-bottom"
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {recommendations.map((rec) => (
              <li
                key={rec.id}
                className="border-primary border-2 flex flex-col"
              >
                <Link
                  to={`/novel/${rec.id}`}
                  className="h-[320px] group  block overflow-hidden"
                >
                  <img
                    src={rec.image}
                    alt={rec.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[320px]"
                  />
                </Link>

                <div className=" border bg-neutral p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {rec.title} ({rec.release_year})
                    </h3>

                    <p className="mt-1.5 text-sm text-gray-700">
                      {rec.authors}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Recommendation;
