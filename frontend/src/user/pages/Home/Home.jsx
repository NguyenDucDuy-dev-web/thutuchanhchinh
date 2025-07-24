import React from "react";
import "./Home.scss";
import Welcome from "../../components/Welcome/Welcome";
import HighlightedEvent from "../../components/HighlightedEvent/HighlightedEvent";
import YourOption from "../../components/YourOption/YourOption";
import QuickAcess from "../../components/QuickAccess/QuickAcess";
import News from "../../components/News/News";
import Toturial from "../../components/Toturial/Toturial";

const Home = () => {
  return (
    <>
      <HighlightedEvent />

      <YourOption />

      <News/>
      
      <Toturial/>
     
    </>
  );
};

export default Home;
