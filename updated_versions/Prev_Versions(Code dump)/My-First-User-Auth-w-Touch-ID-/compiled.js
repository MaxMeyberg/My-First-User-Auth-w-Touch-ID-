"use strict";

var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function App() {
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("h1", null, "Hello, Electron with React!"), /*#__PURE__*/_react["default"].createElement("p", null, "This is a simple Electron app using React."));
}
_reactDom["default"].render(/*#__PURE__*/_react["default"].createElement(App, null), document.getElementById('root'));
