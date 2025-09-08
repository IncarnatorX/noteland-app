import { useState, useEffect, useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { toast } from "react-toastify";

const AuthComponent = () => {
  const {
    openAuthComponent,
    setOpenAuthComponent,
    authComponentRef,
    setUser,
    setUserLoggedIn,
    setRefreshNotes,
    authenticating,
    setAuthenticating,
  } = useContext(NotesContext);

  const [showPassword, setShowPassword] = useState(false);

  const [authKind, setAuthKind] = useState("login");

  const [password, setPassword] = useState("");

  async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.currentTarget));

    setAuthenticating(true);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auth/${
        authKind === "login" ? "login" : "register"
      }`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      setOpenAuthComponent(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ?? "Login failed. Please try again..."
        );
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setRefreshNotes((prev) => !prev);
      }

      if (authKind === "login") {
        setUser(data.user);
        setUserLoggedIn(true);
      }
    } catch (error) {
      console.error("Error occurred when submitting login request:", error);
      setOpenAuthComponent(false);
      toast.error(error.message ?? "Login failed. Please try again...");
    } finally {
      event.target.reset();
      setAuthenticating(false);
    }
  }

  useEffect(() => {
    function handleAuthComponent(event) {
      if (event.key === "Escape") {
        setOpenAuthComponent(false);
      }
    }

    if (openAuthComponent) {
      authComponentRef?.current?.showModal();
    } else {
      authComponentRef?.current?.close();
    }

    document.addEventListener("keydown", handleAuthComponent);

    return () => {
      document.removeEventListener("keydown", handleAuthComponent);
    };
  }, [openAuthComponent]);

  return (
    <dialog ref={authComponentRef} className="auth-component-dialog">
      <form method="dialog" className="auth-form" onSubmit={handleFormSubmit}>
        <h2>{authKind === "login" ? "Login" : "Register"}</h2>

        {authKind === "register" && (
          <div className="field-group">
            <label htmlFor="name" className="field-group-label">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="auth-form-email auth-form-input"
              placeholder="Enter your name"
              required
            />
          </div>
        )}

        <div className="field-group">
          <label htmlFor="email" className="field-group-label">
            Email address:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="auth-form-email auth-form-input"
            placeholder="Enter email address"
            autoComplete="on"
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="password" className="field-group-label">
            Password:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            className="auth-form-password auth-form-input"
            placeholder="Enter password"
            required
            minLength={8}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        {password?.length > 1 && password?.length < 8 && (
          <span className="password-err-msg">
            Password must be greater than 8 characters!
          </span>
        )}
        <div className="password-checkbox">
          <input
            type="checkbox"
            name="checkbox"
            id="show-password"
            onChange={() => setShowPassword((prev) => !prev)}
          />
          <label htmlFor="show-password" className="show-password-text">
            Show password
          </label>
        </div>

        {authKind === "login" && (
          <p>
            Need an account?{" "}
            <span className="here-text" onClick={() => setAuthKind("register")}>
              Signup!
            </span>
          </p>
        )}

        {authKind === "register" && (
          <p>
            Already have an account?{" "}
            <span className="here-text" onClick={() => setAuthKind("login")}>
              Login!{" "}
            </span>
          </p>
        )}

        <input
          type="submit"
          value={
            authKind === "login"
              ? authenticating
                ? "Authenticating..."
                : "Login"
              : "Register"
          }
          disabled={authenticating}
          className="login-btn"
        />
      </form>
    </dialog>
  );
};

export default AuthComponent;
