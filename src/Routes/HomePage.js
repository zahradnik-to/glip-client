import React from "react";
import LinkBanner from "../Components/LinkBanner";
import { Container } from "react-bootstrap";

function HomePage() {

  return (
    <>
      <Container className="pt-5">
        <h1 className="text-center mt-3">OBJEDNÁVKY</h1>
        <LinkBanner title="KOSMETIKA" hrefLink="/kosmetika"/>
        <LinkBanner title="KADERNICTV" hrefLink="/kadernictvi"/>
        <LinkBanner title="MASÁŽE" hrefLink="/masaze"/>
      </Container>
    </>
  )
}

export default HomePage