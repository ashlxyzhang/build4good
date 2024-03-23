import React, { useEffect, useState } from "react";
import axios from "axios";

const Vinyls = () => {
  const [vinyls, setVinyls] = useState([]);
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
  return (
    <div>
      {vinyls.map((vinyl: any, index) => (
        <p key={index}>{vinyl.properties.album.rich_text[0].plain_text}</p>
      ))}
    </div>
  );
};

export default Vinyls;
