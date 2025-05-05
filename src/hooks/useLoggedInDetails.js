import { useEffect, useState } from "react";

export default function useUserData() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = () => {
      try {
        if (window?.SecureTokenProvider?.getUserLoggedInData) {
          const freshData = window.SecureTokenProvider.getUserLoggedInData();
          setUserData(freshData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    const handleUserDataChange = (event) => {
      setUserData(event.detail);
    };

    window.addEventListener("user-data-changed", handleUserDataChange);

    // Clean up
    return () => {
      window.removeEventListener("user-data-changed", handleUserDataChange);
    };
  }, []); // Empty dependency array to only run once on mount

  return userData;
}
