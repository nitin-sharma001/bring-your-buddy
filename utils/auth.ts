"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    useEffect(() => {

        const user = localStorage.getItem("user");
        if (user) {
            setIsAuthenticated(true);

        }
        else {
            setIsAuthenticated(false);
            router.push("login");
        }
    }, []);
    return { isAuthenticated}

}
export default useAuth;