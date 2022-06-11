import { Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Contract } from "ethers";

type ResellTableProps = {
  tickets: any[];
  handleClick: any;
};

export const ResellTable = ({ tickets, handleClick }: ResellTableProps) => {
  return (
    <Table variant="simple" marginTop={18}>
      <Thead>
        <Tr>
          <Th>Token ID</Th>
          <Th>Token Address</Th>
          <Th>Price</Th>
          <Th>Purchase</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tickets.map((stub: Contract, id: number) => {
          return (
            <Tr key={id}>
              <Td>{stub.tokenId}</Td>
              <Td>{stub.address}</Td>
              <Td>{stub.price}</Td>
              <Td>
                <Button
                  onClick={() =>
                    handleClick(stub.address, stub.tokenId, stub.price)
                  }
                  _focus={{ boxShadow: "none" }}
                >
                  Purchase
                </Button>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
