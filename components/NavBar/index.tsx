import { Flex, Stack } from "@chakra-ui/react";

import { DropDownMenu } from "./DropDownMenu";
import ConnectWeb3 from "../Modals/ConnectWeb3";
import { useUserContext } from "../../contexts/userContext";
import { reqLogout } from "../../services/siwe";
import { LogoLeft } from "./LogoLeft";

export const NavBar = () => {
  const { address, clearUserSession, updateUserSession } = useUserContext();
  const disconnect = async () => {
    await reqLogout(); // end session
    clearUserSession(); // clear user context
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={4}
    >
      <LogoLeft />
      <Stack direction="row" spacing={4}>
        {address ? (
          <DropDownMenu address={address} disconnect={disconnect} />
        ) : (
          <ConnectWeb3 updateUserSession={updateUserSession} />
        )}
      </Stack>
    </Flex>
  );
};
