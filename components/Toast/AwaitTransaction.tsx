import { Image, Box, keyframes } from "@chakra-ui/react";

export const AwaitTransaction = () => {
  return (
    <Box
      //bg="linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
      bgGradient="linear(to-r, teal.500, green.800)"
      background-size="400% 400%"
      w="50%"
      p={4}
      borderRadius="10px"
      animation="Grad 3s ease-in-out 0s infinite alternate"
    >
      <Image
        z-index="1"
        boxSize="30px"
        objectFit="cover"
        textAlign="right"
        float="left"
        src="/ethlogo.png"
        alt="eth"
      />
      <div>Loading...</div>
    </Box>
  );
};
