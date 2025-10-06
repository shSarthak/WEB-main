import React, { useEffect } from "react";

function GoogleLoginButton({ onLoginSuccess }) {
  useEffect(() => {
    /* global google */
    if (!window.google) {
      console.error("Google SDK not available. Make sure <script src='https://accounts.google.com/gsi/client' async defer></script> is in index.html");
      return;
    }

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "453853523481-tkhduad28jur3ojh5iq73l4mbja5lf86.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" }
    );

    // optional: auto prompt disabled
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log("Google credential response:", response);
    try {
      const res = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();
      console.log("Backend /auth/google response:", data);

      if (data?.jwt && data?.user) {
        // persist for frontend usage
        sessionStorage.setItem("jwt", data.jwt);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        // notify parent (Header)
        if (typeof onLoginSuccess === "function") onLoginSuccess(data.user);

        // let header/shop know cart changed (or to trigger fetch)
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        console.error("Login failed — server didn't return jwt+user:", data);
      }
    } catch (err) {
      console.error("Error sending token to backend:", err);
    }
  };

  return <div id="googleSignInDiv"></div>;
}

export default GoogleLoginButton;
