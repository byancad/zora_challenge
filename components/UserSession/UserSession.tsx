import { useUserContext } from "contexts/userContext";
import { useWagmi } from "hooks/useWagmi";
import { FC, useEffect } from "react";
import { reqUserSession } from "services/siwe";

type UserSessionProps = {
  children: JSX.Element | JSX.Element[];
};

export const UserSession: FC<UserSessionProps> = ({ children }) => {
  const { updateUserSession } = useUserContext();
  useWagmi();

  useEffect(() => {
    const checkForUserSession = async () => {
      const res = await reqUserSession();
      if (res && res.address) {
        updateUserSession({ ...res });
      }

      // here we should if there is a signer / siwe address mismatch
    };

    // 1. page loads
    (async () => await checkForUserSession())();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", checkForUserSession);
    return () => window.removeEventListener("focus", checkForUserSession);
  }, []);
  return <>{children}</>;
};
