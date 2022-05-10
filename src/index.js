import { faBackward, faFastBackward, faFastForward, faForward, faPlus, faSearch, faSortAlphaDown, faSortAlphaUpAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Request from "superagent";
import { Button, Form, FormControl, InputGroup, Pagination, Table } from "react-bootstrap";
import EnUs from "./lang/EnUs";

class ActionTable extends React.Component {

    static defaultProps = {
        getHeaders: () => ({}),
        mapStateToParams: state => state,
        mapResponseToData: ({ body }) => body,
        onError: error => console.error(error),
        onUpdate: data => console.info(data),
        endpoint: undefined,
        data: undefined,
        lang: EnUs,
        getActionButtonComponent: (row, action) => props =>
            <Button {...props} title={action.title ?? action.toString()} variant='outline-primary'>
                {action.title ?? action.toString()}
            </Button>,
        onNewRecordClick: null,
        onAction: (row, action, update) => {
            console.log(row, action);
            update();
        },
        toolsPosition: 'top'
    }

    timeout = null;

    state = {
        data: ActionTable.normalize(this.props.data),
        order: undefined,
        dir: undefined,
        filter: '',
        limit: 10,
        offset: 0
    };

    componentDidMount() {
        this.update();
    }

    static normalize = (data = [], lang = EnUs) => {

        const rows = (data.rows ?? data ?? [])
            .map(row => ({
                columns: row.columns ?? (Array.isArray(row)? row : [row.toString()] ),
                actions: (row.actions ?? [])
            }));

        const headers = (data.headers ?? new Array(Math.max(0, ...rows.map(row => row.columns.length))).fill(undefined).map((header, index) => `${lang.Column} ${index+1}`))
            .map(header => ({
                title: header.title ?? header,
                order: header.order ?? header.title ?? header
            }));

        const count = data.count ?? rows.length;

        return { headers, rows, count };
    }

    update() {

        if (this.props.endpoint) {

            const method = this.props.endpoint.method ?? `get`;

            const url = this.props.endpoint.url ?? this.props.endpoint;

            const headers = this.props.getHeaders();

            const format = method === 'get' ? 'query' : 'send';

            const params = this.props.mapStateToParams({
                filter: this.state.filter,
                limit: this.state.limit,
                offset: this.state.limit ? this.state.offset : 0,
                order: this.state.order,
                dir: this.state.dir
            });

            Request[method](url).set(headers)[format](params)
                .then(response => {
                    const data = ActionTable.normalize(this.props.mapResponseToData(response), this.props.lang);
                    this.setState(() => ({ data }), () => this.props.onUpdate(this.state.data));
                })
                .catch(err => this.props.onError(err));

        } else {

            const data = ActionTable.normalize(this.props.data, this.props.lang);

            this.setState(state => {
                const filters = state.filter.split(" ");
                const rows = data.rows
                    .filter(row => filters.every(filter => row.columns.some(column => column.toString().includes(filter))))
                    .sort((rowA, rowB) => {
                        const index = data.headers.findIndex(header => header.order === state.order);
                        return index < 0 ? 0 : rowA.columns[index].toString().localeCompare(rowB.columns[index].toString()) * (state.dir === `DESC` ? -1 : 1);
                    });
                return {
                    data: {
                        headers: data.headers,
                        rows: rows.slice(
                            state.limit > 0 ? state.offset : undefined, 
                            state.limit > 0 ? state.offset + state.limit : undefined
                        ),
                        count: rows.length
                    }
                }

            }, () => this.props.onUpdate(this.state.data));

        }

    }

    setOrder(order) {

        if (order === this.state.order) {
            if (this.state.dir === 'ASC') {
                this.setState(() => ({ dir: 'DESC' }), () => this.update());
            } else {
                this.setState(() => ({ order: undefined, dir: undefined }), () => this.update());
            }
        } else {
            this.setState(() => ({ order: order, dir: 'ASC' }), () => this.update());
        }

    }

    setFilter(event) {
        this.setState(() => ({ filter: event.target.value, offset: 0 }), () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.update(), 400);
        });
    }

    setPage(page) {
        this.setState(state => ({ offset: (page - 1) * state.limit }), () => this.update());
    }

    setLimit(limit) {
        this.setState(() => ({ limit: limit, offset: 0 }), () => this.update());
    }

    render() {

        const data = this.state.data;

        const headers = data.headers.map(
            (header, key) => {
                const icon = this.state.order === header.order ? (
                    this.state.dir === 'ASC' ?
                        <FontAwesomeIcon icon={faSortAlphaDown} /> :
                        <FontAwesomeIcon icon={faSortAlphaUpAlt} />
                ) : null;
                return (
                    <th className="bg-light actiontable-header" key={key} role="button" onClick={() => this.setOrder(header.order)}>
                        {icon} {header.title}
                    </th>
                );
            }
        );

        if (headers.length > 0 && data.rows.some(row => row.actions.length > 0)) {
            headers.push(
                <th className="bg-light d-print-none actiontable-header-actions" key={headers.length}>
                    {this.props.lang.Actions}
                </th>
            )
        };

        const rows = data.rows.map((row, key) => {

            const actions = row.actions.map((action, key) => {
                const ActionButton = this.props.getActionButtonComponent(action);
                return <ActionButton key={key} className="actiontable-actionbutton" onClick={() => this.props.onAction(row, action, () => this.update())} />;
            });

            const cols = row.columns.map(
                (column, key) => <td key={key} className="actiontable-row-column">{column}</td>
            );

            if (actions.length > 0) cols.push(
                <td key={cols.length} className="d-print-none actiontable-row-actions">
                    {actions}
                </td>
            );

            return <tr key={key} className="actiontable-row">{cols}</tr>;

        });

        const pages = data.count > 0 && this.state.limit > 0 ? parseInt((data.count - 1) / this.state.limit) + 1 : 1;

        const page = this.state.limit > 0 ? parseInt(this.state.offset / this.state.limit) + 1 : 1;

        const max = 5;
        const half = parseInt(max / 2);

        let start = page - half
        let end = page + half;

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

        const buttons = [];

        for (let p = start; p <= end; p = p + 1) {
            buttons.push(
                <Pagination.Item active={p === page} key={p - start} onClick={() => this.setPage(p)}>
                    {p}
                </Pagination.Item>
            );
        }

        const tools =
            <tr className="d-print-none actiontable-tools">
                <td colSpan={headers.length}>
                    <Form as="div" className="d-flex align-items-stretch flex-wrap">
                        {this.props.onNewRecordClick &&
                            <div className="mr-2 my-2">
                                <Button size="sm" variant='outline-success' onClick={event => this.props.onNewRecordClick(event, () => this.update())}>
                                    <FontAwesomeIcon icon={faPlus} />&nbsp;{this.props.lang.NewRecord}
                                </Button>
                            </div>
                        }
                        <div className="mr-2 my-2 flex-grow-1">
                            <InputGroup size="sm">
                                <InputGroup.Prepend >
                                    <InputGroup.Text variant="primary">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    placeholder={this.props.lang.Search}
                                    onChange={(event) => this.setFilter(event)}
                                    value={this.state.filter}
                                />
                            </InputGroup>
                        </div>
                        <div className="small mr-2 my-2 d-flex align-items-center">
                            <div><strong>{this.props.lang.Total}:</strong>&nbsp;{data.count} {data.count === 1 ? this.props.lang.record : this.props.lang.records}.</div>
                        </div>
                        <div className="mr-2 my-2">
                            <FormControl
                                size="sm"
                                value={data.limit}
                                onChange={(event) => this.setLimit(event.target.value)}
                                as="select"
                            >
                                <option value={10}>10 {this.props.lang.records}</option>
                                <option value={20}>20 {this.props.lang.records}</option>
                                <option value={50}>50 {this.props.lang.records}</option>
                                <option value={100}>100 {this.props.lang.records}</option>
                                <option value={0}>{this.props.lang.AllRecords}</option>
                            </FormControl>
                        </div>
                        <div>
                            <Pagination size="sm" className="my-2">
                                <Pagination.Item onClick={() => this.setPage(1)} disabled={page === 1} title={this.props.lang.First}>
                                    <FontAwesomeIcon icon={faFastBackward} />
                                </Pagination.Item>
                                <Pagination.Item onClick={() => this.setPage(page - 1)} disabled={page === 1} title={this.props.lang.Previous}>
                                    <FontAwesomeIcon icon={faBackward} />
                                </Pagination.Item>
                                {buttons}
                                <Pagination.Item onClick={() => this.setPage(page + 1)} disabled={page === pages} title={this.props.lang.Next}>
                                    <FontAwesomeIcon icon={faForward} />
                                </Pagination.Item>
                                <Pagination.Item onClick={() => this.setPage(pages)} disabled={page === pages} title={this.props.lang.Last}>
                                    <FontAwesomeIcon icon={faFastForward} />
                                </Pagination.Item>
                            </Pagination>
                        </div>
                    </Form>
                </td>
            </tr>
            ;

        const body = rows.length > 0 ? rows :
            <tr className="actiontable-rows">
                <td colSpan={headers.length} className="text-center my-5">
                    <strong>{this.props.lang.NoRecordsFound}</strong>
                </td>
            </tr>
            ;

        return (
            <Table responsive className="actiontable-table" size="sm" hover>
                <thead>
                    {(this.props.toolsPosition === 'top' || this.props.toolsPosition === 'both') && tools}
                    <tr className="bg-light actiontable-headers">{headers}</tr>
                </thead>
                <tbody className="actiontable-rows">
                    {body}
                </tbody>
                <tfoot>
                    {(this.props.toolsPosition === 'bottom' || this.props.toolsPosition === 'both') && tools}
                </tfoot>
            </Table>
        );
    }
}

export default ActionTable;