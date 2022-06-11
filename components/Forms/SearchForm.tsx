import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { useAlertContext } from "contexts/alertContext";
import { useSkaleStubFactoryContract } from "hooks/useSkaleStubFactoryContract";
import { useState } from "react";

type SearchFormProps = {
  getStubAddress: (id: number) => void;
};

export const SearchForm = ({ getStubAddress }: SearchFormProps) => {
  const [searchText, setSearchText] = useState<number>();

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    if (searchText) {
      await getStubAddress(searchText);
    }
  };

  const handleChange = async (e: any): Promise<void> => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl marginTop={4}>
          <FormHelperText textAlign="center" fontSize="50px" color="white">
            Search Tickets
          </FormHelperText>
          <FormLabel htmlFor="address"></FormLabel>
          <InputGroup width={620} _focus={{ boxShadow: "none" }} marginTop={6}>
            <Input
              onChange={handleChange}
              value={searchText}
              width="100%"
              _focus={{ boxShadow: "none" }}
            />
            <InputRightElement width="5.5rem">
              <Button
                type="submit"
                h="1.75rem"
                w="3rem"
                size="sm"
                _focus={{ boxShadow: "none" }}
                bgGradient="linear(to-l, #7928CA, #FF0080)"
              >
                go
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
    </div>
  );
};
