import { ref } from "vue";
import swal from "sweetalert";

const apiKey = "9ba3f19378eba6cb60a5fd7e3b960569";
const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YmEzZjE5Mzc4ZWJhNmNiNjBhNWZkN2UzYjk2MDU2OSIsInN1YiI6IjY2M2ZhZDA1Y2VjZjM0NjNjZmY5ZmI5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XdhdZoSfBioEtXmwbKa5qydGZ6c2VLGO2CWcQKoHZaM";

const isAuthenticated = ref(false);
const username = ref(null);

export default function useUserAuth() {
  const generatedUserToken = async () => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/authentication/token/new",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Unexpected error occured!");
        return null;
      }

      const result = await response.json();

      return result.request_token;
    } catch (error) {
      if (error instanceof Error) console.log(error.stack);
      return null;
    }
  };

  const login = async (data) => {
    const requestToken = await generatedUserToken();

    try {
      if (requestToken) {
        const response = await fetch(
          "https://api.themoviedb.org/3/authentication/token/validate_with_login",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: data.username,
              password: data.password,
              request_token: requestToken,
            }),
          }
        );

        if (!response.ok) {
          console.error("Failed logging in!");
          console.error(response);
          swal("Login Failed", "Unexpected error occured", "error");
          return;
        }

        const result = await response.json();

        if (result.success) {
          isAuthenticated.value = result.success;
          username.value = data.username;

          localStorage.setItem("currentUser", JSON.stringify(data.username));
          localStorage.setItem(
            "request_token",
            JSON.stringify(result.request_token)
          );

          swal("Login Success!", `Welcome back, ${data.username}`, "success");
        } else {
          swal("Login Failed", "Unexpected error occured", "error");
        }
      } else {
        swal("Login Failed", "Unexpected error occured", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    swal({
      text: "Are you sure you want to log out?",
      buttons: ["Cancel", "Logout"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("request_token");
        isAuthenticated.value = false;
        username.value = null;
        swal("You've successfully logged out!", {
          icon: "success",
        });
      }
    });
  };

  const setIsAuthenticated = (state) => {
    isAuthenticated.value = state;
  };

  const setUsername = (name) => {
    username.value = name;
  };

  return {
    isAuthenticated,
    username,
    setIsAuthenticated,
    setUsername,
    login,
    logout,
  };
}
