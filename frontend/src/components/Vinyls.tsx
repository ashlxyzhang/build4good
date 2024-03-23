import React, { useEffect, useState } from "react";
import "../components/style.css";
import axios from "axios";
import Navbar from "./Navbar";

const Vinyls = () => {
  const [vinyls, setVinyls] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchVinylsWithArt = async () => {
      try {
        const response = await axios.get<any[]>("http://localhost:8000/vinyls");
        const vinylsWithArt = await Promise.all(
          response.data.map(async (vinyl) => {
            const albumPicture = await album_art(
              vinyl.properties.album.rich_text[0].plain_text,
              vinyl.properties.ars_name.title[0].plain_text
            );
            return { ...vinyl, albumPicture };
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
          `http://localhost:8000/search_vinyls?prop=${inputValue}`
        );
        const vinylsWithArt = await Promise.all(
          response.data.map(async (vinyl) => {
            const albumPicture = await album_art(
              vinyl.properties.album.rich_text[0].plain_text,
              vinyl.properties.ars_name.title[0].plain_text
            );
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

  const album_art = async (
    albumName: string,
    artistName: string
  ): Promise<string | undefined> => {
    try {
      const response = await axios.get<any>(
        `http://127.0.0.1:5000/get_album_art?album_title=${albumName}&artist_name=${artistName}`
      );
      return response.data; // Assuming the response contains the URL of the album art
    } catch (error) {
      console.error("Error fetching album art: ", error);
      return undefined; // Return undefined in case of error
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={search}>
        <input
          type="text"
          placeholder="Search for an album by name or artist"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="flex justify-around text-center flex-wrap">
        {vinyls.map((vinyl: any, index) => (
          <div key={index} className="wrapper flex">
            <div className="product-img">
              <img src={vinyl.albumPicture} />
            </div>
            <div className="flex flex-col justify-center align-middle text-center">
              <div className="product-text text-center">
                <h1>{vinyl.properties.album.rich_text[0].plain_text}</h1>
                <h2>by {vinyl.properties.ars_name.title[0].plain_text}</h2>
              </div>
              <div>
                <p>
                  <span>$10.99</span>
                </p>
                <button type="button">buy now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Vinyls;
