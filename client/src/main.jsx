import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "@/store/index.js";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "@/assets/css/reset.css";
import ScrollToTop from "./ScrolooTop";
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode> 태그로 이 감싸져있으면
  // 개발모드에서 (개발 단계시 오류를 잘 잡기위해) 두 번씩 렌더링함
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop />
      <GoogleOAuthProvider clientId={googleClientId}>
      <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>,
);
