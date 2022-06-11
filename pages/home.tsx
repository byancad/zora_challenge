import { Box, Container, useDisclosure } from "@chakra-ui/react";
import { SearchForm } from "components/Forms/SearchForm";
import { TicketPurchaseModal } from "components/Modals/TicketPurchaseModal/TicketPurchaseModal";
import { NavBar } from "components/NavBar";
import { TicketTable } from "components/Tables/TicketTable";
import { useContractContext } from "contexts/contractContext";
import { useSkaleStubFactoryContract } from "hooks/useSkaleStubFactoryContract";
import { useState } from "react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const { events } = useContractContext();
  const { getStubAddress, getRandom } = useSkaleStubFactoryContract();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [currentEvent, setCurrentEvent] = useState<any>({});
  const eventAddresses = Object.values(events);

  return (
    <>
      <NavBar />
      <Container color="white" marginTop={100} centerContent>
        <Box
          backgroundColor="#5662a6"
          opacity="90%"
          borderRadius="4px"
          padding={9}
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
          boxShadow="dark-lg"
          ml="2"
        >
          <SearchForm getStubAddress={getStubAddress} />
          {!!eventAddresses?.length && (
            <TicketTable
              eventAddresses={eventAddresses}
              onOpen={onOpen}
              setCurrentEvent={setCurrentEvent}
            />
          )}
          <TicketPurchaseModal
            isOpen={isOpen}
            onClose={onClose}
            event={currentEvent}
            getRandom={getRandom}
          />
        </Box>
      </Container>
    </>
  );
};

export default Home;
