import React, { useContext, useEffect, useState } from "react";
import { Axios } from "../../../Config/Axios/Axios";
import { UserContext } from "../../../App";
import { MailFilled, PhoneFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useToast } from "../../../Components/ToastContext/ToastContext";
import LoginLoaderOverlay from "../../../Components/LoginLoaderOverlay/LoginLoaderOverlay";
import { Button } from "antd";
import { PasskeyFillIcon } from "@primer/octicons-react";

const Login = ({ setauthenticated }) => {
  const [email, setemail] = useState("");
  const [pswd, setpswd] = useState("");
  const [viewPassword, setviewPassword] = useState(false);
  const [err, seterr] = useState("");
  const [loader, setLoader] = useState(true);

  const { setUser } = useContext(UserContext);
  const toastMessage = useToast();
  const nav = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      setLoader(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await Axios.post(
            "/api/v1/app/auth/whoami",
            {},
            {
              headers: {
                authorization: `bearer ${token}`,
              },
            }
          );
          setUser(response.data.user);
        }
      } catch (err) {
        console.log(err);
        seterr("Session Expired! login again...");
        localStorage.removeItem("token");
      } finally {
        setLoader(false);
      }
    };

    checkSession();
  }, [setUser, nav]);

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      login(codeResponse);
      toastMessage("here");
    },
    onError: () => {
      toastMessage("error", "Login Failed. Please try again.");
      setLoader(false);
    }
  });

  const login = async (credentialResponse) => {
    setLoader(true);
    try {
      const token = credentialResponse.access_token;
      const response = await Axios.post("/api/v1/app/auth/signUpWithGoogle", {}, {
        headers: {
          authorization: `bearer ${token}`,
        },
      });
      const { user, token: newToken } = response.data;
      setUser(user);
      localStorage.setItem("token", newToken);
      toastMessage("success", "Login Successful.");
    } catch (error) {
      console.error("Login Failed:", error);
      toastMessage("error", "Login Failed. Please try again.");
      seterr("Login Failed. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const passkeyLogin = async () => {
    toastMessage("info", "Passkey login is currently unavailable.");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      login();
    }
  };

  return (
    <>
      <section className="login-page py-3 py-md-5 py-xl-8" style={{ height: "100vh", width: "100vw" }}>
        <div className="container mt-5">
          <div className="row gy-4 align-items-center">
            <div className="col-12 col-md-6 col-xl-7">
              <div className="d-flex justify-content-center login-page-content text-white">
                <div className="col-12 col-xl-9">
                  <h1><b>Manage My Truck</b></h1>
                  <hr className="border-primary-subtle mb-4" />
                  <p className="lead mb-5">
                    Efficiently manage your fleet with <strong>Manage My Truck</strong>. Track expenses, monitor
                    profits, and generate detailed reports with ease.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-5">
              <div className="card border-0 rounded-4">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-4">
                        <h3>Sign in</h3>
                      </div>
                    </div>
                  </div>
                  <div className="w-100 d-flex flex-column gap-3 justify-content-start">
                    <Button
                      onClick={() => googleLogin()}
                      className="w-100"
                      style={{ padding: "18px 0" }}
                    >
                      <div style={{ width: '25px' }}>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA4CAMAAABuU5ChAAAA+VBMVEX////pQjU0qFNChfT6uwU0f/O4zvs6gfSJr/j6twDoOisjePPoNSXpPjDrWU/oLRr+9vZ7pff/vAAUoUAkpEn0ran619b82pT7wgD+68j947H/+e7//PafvPm/0vuBw5Df7+P63tz3xcPxl5HnJQ7qUEXxj4n4z83zoJzqSz/vgXrucWrsY1r1tbHrSBPoOjbvcSr0kx74rRH80XntZC3xhSPmGRr86+r4sk/936EJcfPS3/yowvnbwVKjsTjx9f5urEjkuBu9tC+ErkJyvoRRpj2az6hWs23j6/0emX2z2btAiuI8k8AyqkE5nZU1pGxCiOxVmtHJ5M+PSt3WAAACGElEQVRIieWSa3fSQBCGk20CJRcW2AWKxgJtqCmieNdatV5SUtFq5f//GJeE7CXJJOT4TZ+PO+c58+7MaNr/SWd60mecTDs1pMFp28dODPZnZw/369TXseXqHNfCblDdte84krTDwUFFwnMnJyXm+bSsmZ/vlcb1+6A2x5C1xYeyPgIyJlhtYDjzjOYyZA3oFighLYxni8UMY6dCG/jy9KzTQfI8DXSnTNN0kcl1lNE9dlxYC8TnnEVmAJ02qHlPllyb58vgmQ2Np0tYgzGMo2ex6IKRihi1mPhcZyYuO8McL4yYl0vrrI6mJZpx9Or1mzqa10rFt8p7o5ArXh+lXutC8d6ZBdiXvH6PeyPFsw8KMBu8fsG9+3t473l9yD1vD+/BX3v1cgqv3lzE/8A9NCUK5sn33vugeN1DQTcVTbG/9M56H+lEAzg2d54t7iW5657xCdEx5PF+B9Lj9oO9z4hBgIZX6YyaXfmZaV9QQkU781h+Hra+7jQaFv6Or8RW3r1rhErES641D9XKigox8jJaQxyAfZOpIQm6kiuT6BvfujqVuEpkkY43u+d1RBBF35v55aVJidKSEBRFiJAk/+0PM3NjgjFFMLc/WVYzlzImLBPprzvzrlBjHUmZSH8DmqatS0QSZtcjTxUBWSlZw1bckhaYlISTcm1rIqKolJJxtRWnXUVscTFsjWFFwoy7WTM2+zX69/gDaLcy7SET9nsAAAAASUVORK5CYII="
                          alt="Google" style={{ width: '20px', marginRight: '10px' }} />
                      </div>
                      Sign in with Google
                    </Button>

                    <Button
                      onClick={() => passkeyLogin()}
                      className="w-100"
                      style={{ padding: "18px 0" }}
                    >
                      <div style={{ width: '25px' }}><PasskeyFillIcon size={18} fill="grey" /></div>
                      Sign in with Passkey
                    </Button>
                  </div>
                  <hr className="border-primary-subtle mb-4" />
                  <div className="row">
                    <div className="col-12">
                      <p className="mt-4 mb-4">Contact us</p>
                      <div className="d-flex gap-2 gap-sm-3 justify-content-start">
                        <a
                          href="mailto:dev.codhub@gmail.com"
                          className="btn btn-outline-success bsb-btn-circle bsb-btn-circle-2xl"
                        >
                          <MailFilled />
                        </a>
                        <a
                          href="#!"
                          className="btn btn-outline-success bsb-btn-circle bsb-btn-circle-2xl"
                        >
                          <PhoneFilled />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LoginLoaderOverlay isVisible={loader} />
    </>
  );
};

export default Login;
