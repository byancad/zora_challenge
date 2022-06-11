import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  VStack,
  Text,
  Image,
  StackDivider
} from "@chakra-ui/react";
import { SiweMessage } from "siwe";
import { useConnect } from "wagmi";
import { reqNonce, reqLogin } from "services/siwe";
import { isClient } from "utils";

type ConnectWeb3Props = {
  updateUserSession: (data: any) => void;
};

const ConnectWeb3 = ({ updateUserSession }: ConnectWeb3Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data: connectData }, connect] = useConnect();

  const login = async (connector: any) => {
    try {
      const res = await connect(connector);
      if (!res.data) throw res.error ?? new Error("Something went wrong");

      const nonce = await reqNonce();
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.data.account,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: res.data.chain?.id,
        nonce
      });

      const signer = await connector.getSigner();
      const signature = await signer.signMessage(message.prepareMessage());

      const verifyRes = await reqLogin(JSON.stringify({ message, signature }));
      if (!verifyRes.session) throw new Error("Error verifying message");

      updateUserSession({ ...verifyRes, signer });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Button
        _focus={{ boxShadow: "none" }}
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        onClick={onOpen}
      >
        Connect
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          padding={"0px"}
          margin={"100px"}
          paddingLeft={"0px"}
          paddingRight={"0px"}
        >
          <ModalBody>
            <VStack spacing="8px">
              {connectData?.connectors.map((connector: any) => (
                <Button
                  disabled={!connector.ready && isClient()}
                  key={connector.id}
                  w="108%"
                  height="100px"
                  onClick={() => login(connector)}
                  _focus={{ boxShadow: "none" }}
                  justifyContent="start"
                >
                  <VStack divider={<StackDivider borderColor="gray.200" />}>
                    <Image
                      height="40px"
                      width="40px"
                      marginLeft={"10px"}
                      src={`${connector.name.replace(/\s+/g, "")}.png`}
                      alt="Dan Abramov"
                    />
                  </VStack>
                  <Text fontSize={"30px"} padding={"5px"} marginLeft={"10px"}>
                    {connector.name}
                    {!connector.ready && " (unsupported)"}
                  </Text>
                </Button>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConnectWeb3;
