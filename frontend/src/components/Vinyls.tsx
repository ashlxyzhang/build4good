import { useEffect, useState } from "react";
import "../components/style.css";
import axios from "axios";
import Navbar from "./Navbar";

const Vinyls = () => {
  const [vinyls, setVinyls] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [recInput, setRecInput] = useState("");

  axios.defaults.baseURL =
    "https://us-central1-ashs-wrld.cloudfunctions.net/collections_api";

  useEffect(() => {
    const fetchVinylsWithArt = async () => {
      try {
        const response = await axios.get<any[]>("/vinyls");
        const vinylsWithArt = await Promise.all(
          response.data.map(async (vinyl) => {
            const albumPicture = await album_art(
              vinyl.properties.album.rich_text[0].plain_text,
              vinyl.properties.ars_name.title[0].plain_text
            );
            return {
              albumPicture: albumPicture,
              album: vinyl.properties.album.rich_text[0].plain_text,
              ars_name: vinyl.properties.ars_name.title[0].plain_text,
            };
          })
        );
        setVinyls(vinylsWithArt);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchVinylsWithArt();
  }, []);

  const search = (event: any) => {
    event.preventDefault();
    const fetchVinylsWithArt = async () => {
      try {
        const response = await axios.get<any[]>(
          `/search_vinyls?prop=${inputValue}`
        );
        const vinylsWithArt = await Promise.all(
          response.data.map(async (vinyl) => {
            const albumPicture = await album_art(
              vinyl.properties.album.rich_text[0].plain_text,
              vinyl.properties.ars_name.title[0].plain_text
            );
            return {
              albumPicture: albumPicture,
              album: vinyl.properties.album.rich_text[0].plain_text,
              ars_name: vinyl.properties.ars_name.title[0].plain_text,
            };
          })
        );
        setVinyls(vinylsWithArt);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchVinylsWithArt();
  };

  const album_art = async (
    albumName: string,
    artistName: string
  ): Promise<string | undefined> => {
    try {
      const response = await axios.get<any>(
        `https://collectionsflask-uiv5uflcoa-uc.a.run.app/get_album_art?album_title=${albumName}&artist_name=${artistName}`
      );
      return response.data; // Assuming the response contains the URL of the album art
    } catch (error) {
      console.error("Error fetching album art: ", error);
      return undefined; // Return undefined in case of error
    }
  };

  const recs = async (event: any) => {
    event.preventDefault();
    const fetchVinylsWithArt = async () => {
      try {
        const response = await axios.get<any[]>(
          `https://collectionsflask-uiv5uflcoa-uc.a.run.app/recommend?album_name=${recInput}`
        );
        console.log(response.data);
        const vinylsWithArt = await Promise.all(
          response.data.map(async (vinyl) => {
            const albumPicture = await album_art(vinyl.album, vinyl.ars_name);
            return { ...vinyl, albumPicture };
          })
        );
        setVinyls(vinylsWithArt);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchVinylsWithArt();
  };

  return (
    <>
      <Navbar />
      <form className="m-3 max-w-md mx-auto" onSubmit={search}>
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Search for an album by name or artist"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>

      <form className="m-3 max-w-md mx-auto" onSubmit={recs}>
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Get recommendations for albums!"
            value={recInput}
            onChange={(e) => setRecInput(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex justify-around text-center flex-wrap">
        {vinyls.map((vinyl: any, index) => (
          <div
            key={index}
            className="wrapper flex justify-between align-middle text-center"
          >
            <div className="product-img">
              <img src={vinyl.albumPicture} />
            </div>
            <div className="flex flex-col justify-center align-middle text-center product-info">
              <div className="product-text text-center">
                <h1>{vinyl.album}</h1>
                <h2 className="uppercase">by {vinyl.ars_name}</h2>
              </div>
              <div className="button">
                <p>
                  <span>$10.99</span>
                </p>
                <button className=" m-2 bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-400 hover:border-transparent rounded">
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Vinyls;
