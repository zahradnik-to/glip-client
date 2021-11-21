import React from "react";
import LinkBanner from "../Components/LinkBanner";
import {Container} from "react-bootstrap";

function HomePage() {

  return (
    <>
      <Container className="pt-5">
        <h1 className="text-center mt-3">MENU</h1>
        <LinkBanner title="LOGIN" hrefLink="/login"/>
        <LinkBanner title="KALENDÁŘ" hrefLink="/calendar"/>
        <LinkBanner title="PROFIL" hrefLink="/profile"/>
        <h1 className="text-center mt-3">OBJEDNÁVKY</h1>
        <LinkBanner title="KOSMETIKA" hrefLink="/kosmetika"/>
        <LinkBanner title="KADERNICTVI" hrefLink="/kadernictvi"/>
        <LinkBanner title="MASÁŽE" hrefLink="/masaze"/>
      </Container>
    </>
  )
}

export default HomePage