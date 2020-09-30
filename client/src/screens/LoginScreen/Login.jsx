import React from "react";
import "./Login.css";

const Login = () => {
  const signIn = () => {
    const container = document.querySelector(".container");
    return container.classList.remove("sign-up-mode");
  };
  const signUP = () => {
    const container = document.querySelector(".container");
    return container.classList.add("sign-up-mode");
  };
  return (
    <div className="container col-12" id="a" >
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i
                className="fas fa-user"
                style={{ height: "100%", marginLeft: "20px" }}
              />
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <i
                className="fas fa-lock"
                style={{ height: "100%", marginLeft: "20px" }}
              />
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" defaultValue="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </form>
          <form action="#" className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i
                className="fas fa-user"
                style={{ height: "100%", marginLeft: "20px" }}
              />
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <i
                className="fas fa-envelope"
                style={{ height: "100%", marginLeft: "20px" }}
              />
              <input type="email" placeholder="Email" />
            </div>
            <div className="input-field">
              <i
                className="fas fa-lock"
                style={{ height: "100%", marginLeft: "20px" }}
              />
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" className="btn" defaultValue="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={signUP}
            >
              Sign up
            </button>
          </div>
          <img
            src={require("../../assets/images/burger.svg")}
            className="image"
            alt="alt"
          />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={signIn}
            >
              Sign in
            </button>
          </div>
          <img
            src={require("../../assets/images/cake.svg")}
            className="image"
            alt="alt"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
