import { Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useUserContext } from "contexts/userContext";
import { Contract } from "ethers";
import { useSkaleStubContract } from "hooks/useSkaleStubContract";
import { useEffect, useState } from "react";

type TicketTableProps = {
  eventAddresses: string[];
  onOpen: () => void;
  setCurrentEvent: (event: any) => void;
};

export const TicketTable = ({
  eventAddresses,
  onOpen,
  setCurrentEvent,
}: TicketTableProps) => {
  const { mint, details } = useSkaleStubContract();
  const [eventDetails, setEventDetails] = useState<{ [address: string]: any }>(
    {}
  );
  const { address: userAddress } = useUserContext();

  useEffect(() => {
    // gets event details by event addresses
    (async () => {
      let tempDetails: { [address: string]: any } = {};
      for (const address of eventAddresses) {
        const info = await details(address);
        tempDetails[address] = info;
      }

      setEventDetails({ ...tempDetails });
    })();
  }, [eventAddresses]);

  const handleBuy = async (contractAddress: any): Promise<void> => {
    setCurrentEvent(eventDetails[contractAddress]);
    await mint(contractAddress, userAddress, "someurl.com");
    onOpen(); // opens confirmation modal
  };

  return (
    <Table variant="simple" marginTop={18} color="white">
      <Thead color="white" marginTop={10}>
        <Tr>
          <Th>Date</Th>
          <Th>Artist</Th>
          <Th>Location</Th>
          <Th>Available</Th>
          <Th>Price</Th>
          <Th>Purchase</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Object.values(eventDetails).map((eventDetail: any, id: number) => {
          return (
            <Tr key={id}>
              <Td>{eventDetail.date}</Td>
              <Td>{eventDetail.artist}</Td>
              <Td>{eventDetail.location}</Td>
              <Td>{eventDetail.capacity}</Td>
              <Td>{eventDetail.price}</Td>
              <Td>
                <Button
                  onClick={() => handleBuy(eventDetail.address)}
                  _focus={{ boxShadow: "none" }}
                  bgGradient="linear(to-l, #7928CA, #FF0080)"
                >
                  Buy One
                </Button>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
