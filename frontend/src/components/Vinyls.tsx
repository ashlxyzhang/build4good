import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Vinyls = () => {
  const [vinyls, setVinyls] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/vinyls")
      .then((response) => {
        console.log(response.data);
        setVinyls(response.data);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  const search = (event: any) => {
    event.preventDefault();
    axios
      .get(`http://localhost:8000/search_vinyls?prop=${inputValue}`)
      .then((response) => {
        console.log(response.data);
        setVinyls(response.data);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
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
          <div key={index} className="bg-yellow-200">
            <p>{vinyl.properties.album.rich_text[0].plain_text}</p>
            <p>{vinyl.properties.ars_name.title[0].plain_text}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Vinyls;
