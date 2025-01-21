import React from "react";
import "../Components/moving_bus.css";
import "../Components/BusSearchForm";
// import BusSearchForm from "../Components/BusSearchForm";

const MovingBus: React.FC = () => {
  return (
    <div id="welcome_root">
      <div className="wrap">
        <h1 className="titlefront">Yathra Mithra</h1>
        <h1 className="parafront">Your Journey, Just One Tap Away!</h1>
      </div>

      <div id="road">
        <div id="cloud1"></div>
        <div id="cloud2"></div>
        <div id="cloud3"></div>
        <div id="cloud4"></div>
        <div id="line"></div>
        <div id="tree"></div>
        <div className="bus">
          <div id="up1"></div>
          <div id="up2"></div>
          <div id="up3"></div>
          <div id="win1"></div>
          <div id="win2"></div>
          <div id="win3"></div>
          <div id="win4"></div>
          <div id="whell1"></div>
          <div id="whell2"></div>
          <div id="whell3"></div>
          <div id="whell4"></div>
          <div id="fuel"></div>
          <div id="light"></div>
          <div id="foggy"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="flex justify-center"></div>

        <div className="mt-16">
          {/* <BusSearchForm isAuthenticated={false} /> */}
          {/* <BusSearchForm /> */}
        </div>
      </div>
    </div>
  );
};

export default MovingBus;
