import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _jsx from "@babel/runtime/helpers/jsx";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

var _FontAwesomeIcon, _FontAwesomeIcon2, _FontAwesomeIcon3, _InputGroup$Prepend, _FontAwesomeIcon4, _FontAwesomeIcon5, _FontAwesomeIcon6, _FontAwesomeIcon7;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import { faBackward, faFastBackward, faFastForward, faForward, faPlus, faSearch, faSortAlphaDown, faSortAlphaUpAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Request from "superagent";
import { Button, Form, FormControl, InputGroup, Pagination, Table } from "react-bootstrap";
import EnUs from "./lang/EnUs";
import { jsx as _jsx2 } from "react/jsx-runtime";

var ActionTable = /*#__PURE__*/function (_React$Component) {
  _inherits(ActionTable, _React$Component);

  var _super = _createSuper(ActionTable);

  function ActionTable() {
    var _this;

    _classCallCheck(this, ActionTable);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "timeout", null);

    _defineProperty(_assertThisInitialized(_this), "state", {
      data: ActionTable.normalize(_this.props.data),
      order: undefined,
      dir: undefined,
      filter: '',
      limit: 10,
      offset: 0
    });

    return _this;
  }

  _createClass(ActionTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.update();
    }
  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      if (this.props.endpoint) {
        var _this$props$endpoint$, _this$props$endpoint$2;

        var method = (_this$props$endpoint$ = this.props.endpoint.method) !== null && _this$props$endpoint$ !== void 0 ? _this$props$endpoint$ : "get";
        var url = (_this$props$endpoint$2 = this.props.endpoint.url) !== null && _this$props$endpoint$2 !== void 0 ? _this$props$endpoint$2 : this.props.endpoint;
        var headers = this.props.getHeaders();
        var format = method === 'get' ? 'query' : 'send';
        var params = this.props.mapStateToParams({
          filter: this.state.filter,
          limit: this.state.limit,
          offset: this.state.limit ? this.state.offset : 0,
          order: this.state.order,
          dir: this.state.dir
        });
        Request[method](url).set(headers)[format](params).then(function (response) {
          var data = ActionTable.normalize(_this2.props.mapResponseToData(response), _this2.props.lang);

          _this2.setState(function () {
            return {
              data: data
            };
          }, function () {
            return _this2.props.onUpdate(_this2.state.data);
          });
        })["catch"](function (err) {
          return _this2.props.onError(err);
        });
      } else {
        var data = ActionTable.normalize(this.props.data, this.props.lang);
        this.setState(function (state) {
          var filters = state.filter.split(" ");
          var rows = data.rows.filter(function (row) {
            return filters.every(function (filter) {
              return row.columns.some(function (column) {
                return column.toString().includes(filter);
              });
            });
          }).sort(function (rowA, rowB) {
            var index = data.headers.findIndex(function (header) {
              return header.order === state.order;
            });
            return index < 0 ? 0 : rowA.columns[index].toString().localeCompare(rowB.columns[index].toString()) * (state.dir === "DESC" ? -1 : 1);
          });
          return {
            data: {
              headers: data.headers,
              rows: rows.slice(state.limit > 0 ? state.offset : undefined, state.limit > 0 ? state.offset + state.limit : undefined),
              count: rows.length
            }
          };
        }, function () {
          return _this2.props.onUpdate(_this2.state.data);
        });
      }
    }
  }, {
    key: "setOrder",
    value: function setOrder(order) {
      var _this3 = this;

      if (order === this.state.order) {
        if (this.state.dir === 'ASC') {
          this.setState(function () {
            return {
              dir: 'DESC'
            };
          }, function () {
            return _this3.update();
          });
        } else {
          this.setState(function () {
            return {
              order: undefined,
              dir: undefined
            };
          }, function () {
            return _this3.update();
          });
        }
      } else {
        this.setState(function () {
          return {
            order: order,
            dir: 'ASC'
          };
        }, function () {
          return _this3.update();
        });
      }
    }
  }, {
    key: "setFilter",
    value: function setFilter(event) {
      var _this4 = this;

      this.setState(function () {
        return {
          filter: event.target.value,
          offset: 0
        };
      }, function () {
        clearTimeout(_this4.timeout);
        _this4.timeout = setTimeout(function () {
          return _this4.update();
        }, 400);
      });
    }
  }, {
    key: "setPage",
    value: function setPage(page) {
      var _this5 = this;

      this.setState(function (state) {
        return {
          offset: (page - 1) * state.limit
        };
      }, function () {
        return _this5.update();
      });
    }
  }, {
    key: "setLimit",
    value: function setLimit(limit) {
      var _this6 = this;

      this.setState(function () {
        return {
          limit: limit,
          offset: 0
        };
      }, function () {
        return _this6.update();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      var data = this.state.data;
      var headers = data.headers.map(function (header, key) {
        var icon = _this7.state.order === header.order ? _this7.state.dir === 'ASC' ? _FontAwesomeIcon || (_FontAwesomeIcon = /*#__PURE__*/_jsx(FontAwesomeIcon, {
          icon: faSortAlphaDown
        })) : _FontAwesomeIcon2 || (_FontAwesomeIcon2 = /*#__PURE__*/_jsx(FontAwesomeIcon, {
          icon: faSortAlphaUpAlt
        })) : null;
        return /*#__PURE__*/_jsx("th", {
          className: "bg-light actiontable-header",
          role: "button",
          onClick: function onClick() {
            return _this7.setOrder(header.order);
          }
        }, key, icon, " ", header.title);
      });

      if (headers.length > 0 && data.rows.some(function (row) {
        return row.actions.length > 0;
      })) {
        headers.push( /*#__PURE__*/_jsx("th", {
          className: "bg-light d-print-none actiontable-header-actions"
        }, headers.length, this.props.lang.Actions));
      }

      ;
      var rows = data.rows.map(function (row, key) {
        var actions = row.actions.map(function (action, key) {
          var ActionButton = _this7.props.getActionButtonComponent(action);

          return /*#__PURE__*/_jsx(ActionButton, {
            className: "actiontable-actionbutton",
            onClick: function onClick() {
              return _this7.props.onAction(row, action, function () {
                return _this7.update();
              });
            }
          }, key);
        });
        var cols = row.columns.map(function (column, key) {
          return /*#__PURE__*/_jsx("td", {
            className: "actiontable-row-column"
          }, key, column);
        });
        if (actions.length > 0) cols.push( /*#__PURE__*/_jsx("td", {
          className: "d-print-none actiontable-row-actions"
        }, cols.length, actions));
        return /*#__PURE__*/_jsx("tr", {
          className: "actiontable-row"
        }, key, cols);
      });
      var pages = data.count > 0 && this.state.limit > 0 ? parseInt((data.count - 1) / this.state.limit) + 1 : 1;
      var page = this.state.limit > 0 ? parseInt(this.state.offset / this.state.limit) + 1 : 1;
      var max = 5;
      var half = parseInt(max / 2);
      var start = page - half;
      var end = page + half;

      if (pages <= max) {
        start = 1;
        end = pages;
      } else if (page <= half + 1) {
        start = 1;
        end = max;
      } else if (end > pages) {
        start = pages - max + 1;
        end = pages;
      }

      var buttons = [];

      var _loop = function _loop(p) {
        buttons.push( /*#__PURE__*/_jsx(Pagination.Item, {
          active: p === page,
          onClick: function onClick() {
            return _this7.setPage(p);
          }
        }, p - start, p));
      };

      for (var p = start; p <= end; p = p + 1) {
        _loop(p);
      }

      var tools = /*#__PURE__*/_jsx("tr", {
        className: "d-print-none actiontable-tools"
      }, void 0, /*#__PURE__*/_jsx("td", {
        colSpan: headers.length
      }, void 0, /*#__PURE__*/_jsx(Form, {
        as: "div",
        className: "d-flex align-items-stretch flex-wrap"
      }, void 0, this.props.onNewRecordClick && /*#__PURE__*/_jsx("div", {
        className: "mr-2 my-2"
      }, void 0, /*#__PURE__*/_jsx(Button, {
        size: "sm",
        variant: "outline-success",
        onClick: function onClick(event) {
          return _this7.props.onNewRecordClick(event, function () {
            return _this7.update();
          });
        }
      }, void 0, _FontAwesomeIcon3 || (_FontAwesomeIcon3 = /*#__PURE__*/_jsx(FontAwesomeIcon, {
        icon: faPlus
      })), "\xA0", this.props.lang.NewRecord)), /*#__PURE__*/_jsx("div", {
        className: "mr-2 my-2 flex-grow-1"
      }, void 0, /*#__PURE__*/_jsx(InputGroup, {
        size: "sm"
      }, void 0, _InputGroup$Prepend || (_InputGroup$Prepend = /*#__PURE__*/_jsx(InputGroup.Prepend, {}, void 0, /*#__PURE__*/_jsx(InputGroup.Text, {
        variant: "primary"
      }, void 0, /*#__PURE__*/_jsx(FontAwesomeIcon, {
        icon: faSearch
      })))), /*#__PURE__*/_jsx(Form.Control, {
        type: "text",
        placeholder: this.props.lang.Search,
        onChange: function onChange(event) {
          return _this7.setFilter(event);
        },
        value: this.state.filter
      }))), /*#__PURE__*/_jsx("div", {
        className: "small mr-2 my-2 d-flex align-items-center"
      }, void 0, /*#__PURE__*/_jsx("div", {}, void 0, /*#__PURE__*/_jsx("strong", {}, void 0, this.props.lang.Total, ":"), "\xA0", data.count, " ", data.count === 1 ? this.props.lang.record : this.props.lang.records, ".")), /*#__PURE__*/_jsx("div", {
        className: "mr-2 my-2"
      }, void 0, /*#__PURE__*/_jsx(FormControl, {
        size: "sm",
        value: data.limit,
        onChange: function onChange(event) {
          return _this7.setLimit(event.target.value);
        },
        as: "select"
      }, void 0, /*#__PURE__*/_jsx("option", {
        value: 10
      }, void 0, "10 ", this.props.lang.records), /*#__PURE__*/_jsx("option", {
        value: 20
      }, void 0, "20 ", this.props.lang.records), /*#__PURE__*/_jsx("option", {
        value: 50
      }, void 0, "50 ", this.props.lang.records), /*#__PURE__*/_jsx("option", {
        value: 100
      }, void 0, "100 ", this.props.lang.records), /*#__PURE__*/_jsx("option", {
        value: 0
      }, void 0, this.props.lang.AllRecords))), /*#__PURE__*/_jsx("div", {}, void 0, /*#__PURE__*/_jsx(Pagination, {
        size: "sm",
        className: "my-2"
      }, void 0, /*#__PURE__*/_jsx(Pagination.Item, {
        onClick: function onClick() {
          return _this7.setPage(1);
        },
        disabled: page === 1,
        title: this.props.lang.First
      }, void 0, _FontAwesomeIcon4 || (_FontAwesomeIcon4 = /*#__PURE__*/_jsx(FontAwesomeIcon, {
        icon: faFastBackward
      }))), /*#__PURE__*/_jsx(Pagination.Item, {
        onClick: function onClick() {
          return _this7.setPage(page - 1);
        },
        disabled: page === 1,
        title: this.props.lang.Previous
      }, void 0, _FontAwesomeIcon5 || (_FontAwesomeIcon5 = /*#__PURE__*/_jsx(FontAwesomeIcon, {
        icon: faBackward
      }))), buttons, /*#__PURE__*/_jsx(Pagination.Item, {
        onClick: function onClick() {
          return _this7.setPage(page + 1);
        },
        disabled: page === pages,
        title: this.props.lang.Next
      }, void 0, _FontAwesomeIcon6 || (_FontAwesomeIcon6 = /*#__PURE__*/_jsx(FontAwesomeIcon, {
        icon: faForward
      }))), /*#__PURE__*/_jsx(Pagination.Item, {
        onClick: function onClick() {
          return _this7.setPage(pages);
        },
        disabled: page === pages,
        title: this.props.lang.Last
      }, void 0, _FontAwesomeIcon7 || (_FontAwesomeIcon7 = /*#__PURE__*/_jsx(FontAwesomeIcon, {
        icon: faFastForward
      }))))))));

      var body = rows.length > 0 ? rows : /*#__PURE__*/_jsx("tr", {
        className: "actiontable-rows"
      }, void 0, /*#__PURE__*/_jsx("td", {
        colSpan: headers.length,
        className: "text-center my-5"
      }, void 0, /*#__PURE__*/_jsx("strong", {}, void 0, this.props.lang.NoRecordsFound)));
      return /*#__PURE__*/_jsx(Table, {
        responsive: true,
        className: "actiontable-table",
        size: "sm",
        hover: true
      }, void 0, /*#__PURE__*/_jsx("thead", {}, void 0, (this.props.toolsPosition === 'top' || this.props.toolsPosition === 'both') && tools, /*#__PURE__*/_jsx("tr", {
        className: "bg-light actiontable-headers"
      }, void 0, headers)), /*#__PURE__*/_jsx("tbody", {
        className: "actiontable-rows"
      }, void 0, body), /*#__PURE__*/_jsx("tfoot", {}, void 0, (this.props.toolsPosition === 'bottom' || this.props.toolsPosition === 'both') && tools));
    }
  }]);

  return ActionTable;
}(React.Component);

_defineProperty(ActionTable, "defaultProps", {
  getHeaders: function getHeaders() {
    return {};
  },
  mapStateToParams: function mapStateToParams(state) {
    return state;
  },
  mapResponseToData: function mapResponseToData(_ref) {
    var body = _ref.body;
    return body;
  },
  onError: function onError(error) {
    return console.error(error);
  },
  onUpdate: function onUpdate(data) {
    return console.info(data);
  },
  endpoint: undefined,
  data: undefined,
  lang: EnUs,
  getActionButtonComponent: function getActionButtonComponent(row, action) {
    return function (props) {
      var _action$title, _action$title2;

      return /*#__PURE__*/_jsx2(Button, _objectSpread(_objectSpread({}, props), {}, {
        title: (_action$title = action.title) !== null && _action$title !== void 0 ? _action$title : action.toString(),
        variant: "outline-primary",
        children: (_action$title2 = action.title) !== null && _action$title2 !== void 0 ? _action$title2 : action.toString()
      }));
    };
  },
  onNewRecordClick: null,
  onAction: function onAction(row, action, update) {
    console.log(row, action);
    update();
  },
  toolsPosition: 'top'
});

_defineProperty(ActionTable, "normalize", function () {
  var _ref2, _data$rows, _data$headers, _data$count;

  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EnUs;
  var rows = ((_ref2 = (_data$rows = data.rows) !== null && _data$rows !== void 0 ? _data$rows : data) !== null && _ref2 !== void 0 ? _ref2 : []).map(function (row) {
    var _row$columns, _row$actions;

    return {
      columns: (_row$columns = row.columns) !== null && _row$columns !== void 0 ? _row$columns : Array.isArray(row) ? row : [row.toString()],
      actions: (_row$actions = row.actions) !== null && _row$actions !== void 0 ? _row$actions : []
    };
  });
  var headers = ((_data$headers = data.headers) !== null && _data$headers !== void 0 ? _data$headers : new Array(Math.max.apply(Math, [0].concat(_toConsumableArray(rows.map(function (row) {
    return row.columns.length;
  }))))).fill(undefined).map(function (header, index) {
    return "".concat(lang.Column, " ").concat(index + 1);
  })).map(function (header) {
    var _header$title, _ref3, _header$order;

    return {
      title: (_header$title = header.title) !== null && _header$title !== void 0 ? _header$title : header,
      order: (_ref3 = (_header$order = header.order) !== null && _header$order !== void 0 ? _header$order : header.title) !== null && _ref3 !== void 0 ? _ref3 : header
    };
  });
  var count = (_data$count = data.count) !== null && _data$count !== void 0 ? _data$count : rows.length;
  return {
    headers: headers,
    rows: rows,
    count: count
  };
});

export default ActionTable;