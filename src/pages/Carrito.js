import React from "react";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import Carrito from "components/Cart/CartPage";

export default () => {
  return (
    <AnimationRevealPage>
      <Header />
        <Carrito/>
      <Footer />
    </AnimationRevealPage>
  );
};