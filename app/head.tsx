const Head = ({ title }: any) => {
  return (
    <>
      <title>{title || "Paber AI"}</title>

      <meta charSet="UTF-8" />

      <meta name="apple-mobile-web-app-capable" content="yes" />

      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      <link rel="icon" type="image/svg" href="/icon.svg" />
    </>
  );
};

export default Head;
