import { Avatar, Box, Link } from "@chakra-ui/react";

export const LogoLeft = () => {
  return (
    <Box>
      <Link
        href="/home"
        style={{
          textDecoration: "none",
          fontSize: "24px",
          fontWeight: "bold"
        }}
        _focus={{ boxShadow: "none" }}
      >
        {/* <img
          width="40px"
          data-testid="kitty-image"
          src="/ticket.png"
          alt="kitty"
        /> */}
        STUB3
      </Link>
    </Box>
  );
};
