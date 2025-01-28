import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import { iniciarSesion } from "scripts/loginScript.js";

const Container = tw(
  ContainerBase
)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;
const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
`;

const MiComponente = () => {
  const iniciarSesionEvento = (event) => {
    event.preventDefault(); // Previene el envío del formulario
    const token = iniciarSesion("joaquin@gmail.com", "P@ssw0rd");
    console.log(token); // Muestra el token en la consola
  };

  return (
    <Form onSubmit={iniciarSesionEvento}>
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Contraseña" />
      <SubmitButton type="submit">
        <LoginIcon className="icon" />
        <span className="text">Iniciar sesión</span>
      </SubmitButton>
    </Form>
  );
};

export default MiComponente;
