import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useClipboard,
  Link
} from "@chakra-ui/react";

import { useEffect } from "react";
import { useAlertContext } from "../../contexts/alertContext";
import { ellipsisString } from "../../utils";

type MenuContainerProps = {
  address: string;
  disconnect: () => void;
};

export const DropDownMenu = ({ address, disconnect }: MenuContainerProps) => {
  const { hasCopied, onCopy } = useClipboard(address);
  const { popToast } = useAlertContext();

  useEffect(() => {
    if (hasCopied) {
      popToast({ title: "Address Copied!" });
    }
  }, [hasCopied]);

  return (
    <Menu>
      <MenuButton
        as={Avatar}
        aria-label="Options"
        icon={<Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />}
        outline="none"
      />

      <MenuList>
        <MenuItem
          onClick={onCopy}
          _focus={{ boxShadow: "none" }}
          style={{ textDecoration: "none" }}
        >
          {ellipsisString(address)}
        </MenuItem>
        <MenuItem>
          <Link
            href="/drop"
            _focus={{ boxShadow: "none" }}
            style={{ textDecoration: "none" }}
          >
            Drop Tickets
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            href={`https://staging-global.transak.com/?apiKey=${process.env.TRANSAK_API_KEY}&fiatCurrency=USD&cryptoCurrencyList=ETH&defaultCryptoCurrency=ETH&walletAddress=${address}&disableWalletAddressForm=true&exchangeScreenTitle=Stub3&isFeeCalculationHidden=true`}
            style={{ textDecoration: "none" }}
          >
            Buy Crypto
          </Link>
        </MenuItem>
        <MenuItem
          onClick={() => disconnect()}
          _focus={{ boxShadow: "none" }}
          style={{ textDecoration: "none" }}
        >
          Disconnect
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
