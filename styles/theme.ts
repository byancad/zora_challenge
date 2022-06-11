import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bgImage: "url('/home.jpg');",
        bgPosition: "center",
        bgRepeat: "no-repeat",
        backgroundSize: "cover",
        bottom: "0",
        height: "700px"
      }
    }
  }
});

export default theme;
