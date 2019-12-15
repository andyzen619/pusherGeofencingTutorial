webpackHotUpdate("static/development/pages/index.js",{

/***/ "./componenets/ChoosePersona.js":
/*!**************************************!*\
  !*** ./componenets/ChoosePersona.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;

/* components/ChoosePersona.js */
//*Componenet allwos up to activeate a selected user


var ChoosePersona = function ChoosePersona(props) {
  var _props$people = props.people,
      people = _props$people === void 0 ? [] : _props$people,
      _props$count = props.count,
      count = _props$count === void 0 ? 3 : _props$count,
      _props$onSelected = props.onSelected,
      onSelected = _props$onSelected === void 0 ? function (f) {
    return f;
  } : _props$onSelected;
  var nameBadgeStyles = {
    fontSize: '0.8rem',
    height: 40,
    borderRadius: 20,
    cursor: 'pointer'
  };

  var choosePersona = function choosePersona(id) {
    return function (evt) {
      return onSelected(id);
    };
  };

  var randomPeople = function randomPeople(count) {
    return function (people) {
      var selected = []; // Andy Is always in selected
      //selected.push(props.people[0])

      var i = 0;
      count = Math.max(0, Math.min(count, people.length));

      while (i < count) {
        var index = Math.floor(Math.random() * people.length);
        if (selected.includes(index)) continue;
        ++i && selected.push(index);
      }

      return selected.map(function (index) {
        var _people$index = people[index],
            id = _people$index.id,
            name = _people$index.name;
        var className = 'd-flex align-items-center text-center text-white bg-secondary font-weight-bold py-2 px-4 mx-1 my-2';
        return __jsx("span", {
          key: index,
          className: className,
          style: nameBadgeStyles,
          title: name,
          onClick: choosePersona(id)
        }, name);
      });
    };
  };

  console.log(props);
  console.log(count);
  return __jsx("div", {
    className: "w-100 h-100 px-3 pb-5 d-flex flex-wrap align-items-center align-content-center justify-content-center"
  }, __jsx("span", {
    className: "h3 text-dark text-center py-3 w-100 font-weight-bold"
  }, "Choose your Persona"), randomPeople(count)(people));
};

/* harmony default export */ __webpack_exports__["default"] = (ChoosePersona);

/***/ })

})
//# sourceMappingURL=index.js.1b2b4870eb0b37bbf6df.hot-update.js.map