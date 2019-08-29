import React from "react";
import { Header, Newsletter, UseCases, Cards, Footer } from "./components";
import "./Landing.scss";

const Landing = ({ me }) => (
  <div className="landing">
    <Header />
    <Newsletter />
    <UseCases />
    <Cards />
    <Footer />
  </div>
);

export default Landing;
