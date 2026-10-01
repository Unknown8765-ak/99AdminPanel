// import { useEffect, type ReactNode } from "react";
// import { useDispatch } from "react-redux";

// import {
//   login,
//   logout,
//   stopLoading,
// } from "../auth/authSlice";

// const API_URL = import.meta.env.VITE_API_URL;

// interface AuthLoaderProps {
//   children: ReactNode;
// }

// interface AuthUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role: "admin" | "customer";
//   isEmailVerified: boolean;
//   isActive: boolean;
// }

// interface AuthResponse {
//   success?: boolean;
//   data?: AuthUser;
//   message?: string;
// }

// const AuthLoader = ({ children }: AuthLoaderProps) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const loadUser = async () => {
//       // console.log("AUTH CHECK START 🚀");

//       try {
//         const res = await fetch(`${API_URL}/auth/me`, {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             Accept: "application/json",
//           },
//         });

//         // console.log("AUTH STATUS 👉", res.status);

//         const contentType = res.headers.get("content-type");

//         if (!contentType?.includes("application/json")) {
//           const text = await res.text();

//           console.error(
//             "NON JSON RESPONSE ❌",
//             text.substring(0, 300)
//           );

//           throw new Error(
//             `Server returned non-JSON response (${res.status})`
//           );
//         }

//        const data: AuthResponse = await res.json();

//         console.log("ME RESPONSE 👉", data);
//         console.log("ME USER 👉", data.data);

//         if (res.status === 401) {
//           console.log("NO TOKEN ❌");
//           dispatch(logout());
//           return;
//         }

//         if (!res.ok) {
//           throw new Error(
//             data.message || "Authentication failed"
//           );
//         }

//         if (!data.data?._id) {
//           throw new Error("User data not found");
//         }

//         dispatch(login(data.data));

//         console.log("AUTH USER DISPATCHED 👉", data.data);
//       } catch (error) {
//         console.error("AUTH CHECK FAILED ❌", error);

//         dispatch(logout());
//       } finally {
//         dispatch(stopLoading());

//         console.log("AUTH CHECK DONE ✅");
//       }
//     };

//     loadUser();
//   }, [dispatch]);

//   return <>{children}</>;
// };

// export default AuthLoader;


import { useEffect, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import {
  login,
  logout,
  stopLoading,
} from "../auth/authSlice";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthLoaderProps {
  children: ReactNode;
}

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "customer";
  isEmailVerified: boolean;
  isActive: boolean;
}

interface AuthResponse {
  statusCode?: number;
  success?: boolean;
  data?: {
    user: AuthUser;
  };
  message?: string;
}

const AuthLoader = ({ children }: AuthLoaderProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      console.log("AUTH CHECK START 🚀");

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        console.log("AUTH STATUS 👉", res.status);

        const contentType =
          res.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          const text = await res.text();

          console.error(
            "NON JSON RESPONSE ❌",
            text.substring(0, 300)
          );

          throw new Error(
            `Server returned non-JSON response (${res.status})`
          );
        }

        const data: AuthResponse = await res.json();

        console.log("ME RESPONSE 👉", data);
        console.log("ME USER 👉", data.data);

        // Not authenticated
        if (res.status === 401) {
          console.log("NO TOKEN ❌");

          dispatch(logout());

          return;
        }

        if (!res.ok) {
          throw new Error(
            data.message || "Authentication failed"
          );
        }

        if (!data.data?.user._id) {
          throw new Error("User data not found");
        }

        // Authenticated
        console.log(
          "AUTH USER DISPATCHED 👉",
          data.data.user
        );

        dispatch(login(data.data.user));
      } catch (error) {
        console.error(
          "AUTH CHECK FAILED ❌",
          error
        );

        dispatch(logout());
      } finally {
        dispatch(stopLoading());

        console.log("AUTH CHECK DONE ✅");
      }
    };

    loadUser();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthLoader;