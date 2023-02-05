import { api } from "../utils/api";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

const VideoGameNotion = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchEnabled, setSearchEnabled] = useState<boolean>(false);
  const { data, isLoading } = api.notion.searchDatabases.useQuery(
    { databaseName: searchTerm },
    {
      enabled: searchTerm != "" && searchEnabled,
      onSuccess: () => {
        setSearchEnabled(false);
      },
    }
  );
  console.log(data);
  const handleSearchSubmit = (event: React.SyntheticEvent) => {
    setSearchEnabled(true);
    event.preventDefault();
  };

  return (
    <div className="p-4">
      <h1>Video Games</h1>

      <form onSubmit={handleSearchSubmit}>
        <label
          htmlFor="default-search"
          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
            />
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Search Databases"
            required
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2.5 bottom-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
      {data?.map((item: any) => {
        return <p key={item.id}>{item?.title![0].plain_text}</p>;
      })}
    </div>
  );
};

const displayDatabase = (database: any) => {
  return <></>;
};
export default VideoGameNotion;
