import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const CLASSES_PER_PAGE = 6;

// Fetch function
const fetchClasses = async ({ page, search }) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/classes?page=${page}&limit=${CLASSES_PER_PAGE}&search=${search}`
  );
  return res.data;
};

const AllClassesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["classes", page, search],
    queryFn: () => fetchClasses({ page, search }),
    keepPreviousData: true,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= (data?.totalPages || 1)) {
      setPage(p);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-[#faba22] text-center">
        All Classes
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-8 flex justify-center">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search classes..."
          className="px-4 py-2 rounded-l bg-zinc-900 text-white focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#faba22] text-black font-semibold rounded-r"
        >
          Search
        </button>
      </form>

      {/* Loading/Error States */}
      {isLoading && (
        <p className="text-center mt-20 text-yellow-400">Loading classes...</p>
      )}
      {isError && (
        <p className="text-center mt-20 text-red-600">Failed to load classes</p>
      )}
      {!isLoading && !isError && !data?.classes?.length && (
        <p className="text-center mt-20">No classes found.</p>
      )}

      {/* Classes Grid */}
      {data?.classes?.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.classes.map((cls) => (
              <div
                key={cls._id}
                className="bg-black rounded-md p-4 shadow-lg text-white"
              >
                <img
                  src={cls.image}
                  alt={cls.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  loading="lazy"
                />
                <h2 className="text-2xl font-semibold mb-2">{cls.name}</h2>
                <p className="mb-3 text-gray-300">{cls.details}</p>

                <div>
                  <h3 className="font-semibold text-[#faba22] mb-2">Trainers</h3>
                  {cls.trainers && cls.trainers.length > 0 ? (
                    <div className="flex space-x-4">
                      {cls.trainers.map((trainer) => (
                        <Link
                          key={trainer._id}
                          to={`/trainers/${trainer._id}`}
                          title={trainer.name}
                          className="block w-16 h-16 rounded-full overflow-hidden border-2 border-[#faba22] hover:border-yellow-400 transition"
                        >
                          <img
                            src={trainer.photoURL || "/default-avatar.png"}
                            alt={trainer.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No trainers available</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-10 space-x-2 flex-wrap">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-[#faba22] text-black font-semibold rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(data.totalPages)].map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-4 py-2 rounded font-semibold ${
                    page === p
                      ? "bg-yellow-600 text-black"
                      : "bg-gray-700 text-white hover:bg-yellow-500"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === data.totalPages}
              className="px-4 py-2 bg-[#faba22] text-black font-semibold rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllClassesPage;
