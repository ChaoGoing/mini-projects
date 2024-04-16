import React from "react";
import ReactDOM from "react-dom/client";

const Hello = () => {
  const [text, setText] = React.useState("Hello Malita!");
  return <span>123123</span>;
};

const root = ReactDOM.createRoot(document.getElementById("malita"));
root.render(React.createElement(Hello));
