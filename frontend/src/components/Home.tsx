import React from "react";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="flex m-10">
        <img style={{ width: "50%" }} src="/vinyl.png" alt="" />
        <div className="m-10 flex flex-col justify-center align-middle text-center">
          <h1 className="m-4" style={{ fontSize: 60 }}>
            Curious Collections
          </h1>
          <p style={{ fontSize: 20 }}>
            Your Indie Record Store for Turntables, Vinyl, Record Store Day & So
            Much More Curious Collections <br /> <br />
          </p>
          <p style={{ fontSize: 15, color: "grey" }}>
            Vinyl Records & More <br />
            Proud member of the CIMS Coalition since 2023
            <br /> Bryan/College Station, Texas AGGIE WOMAN OWNED AND OPERATED
            <br /> Est. 2016
            <br /> Questions? Use the chat bubble below or call (979) 704-3059
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
