import React from 'react';
import ReactDOM from 'react-dom/client';
import ActionTable from '../src';
import faker from '@faker-js/faker';
import PtBr from '../src/lang/PtBr';

import "bootstrap/dist/css/bootstrap.css";
import "../src/css/actiontable.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

const newRecord = () => ({
  columns: [
    faker.name.findName(),
    faker.internet.email(),
    faker.address.streetAddress(),
    faker.random.word()
  ],
  actions: [
    "Edit", "Delete"
  ]
});

const data = {
  //headers: ["Name", "Email", "Address", "Status"],
  rows: new Array(5).fill(undefined).map(newRecord)
}

console.log(data);

root.render(
  <React.StrictMode>
    <ActionTable
      //endpoint="http://actiontable.free.beeceptor.com"
      data={data}
      lang={PtBr}
      onNewRecordClick={(event, update) => {
        console.log(event);
        data.rows.push(newRecord());
        update();
      }} />
  </React.StrictMode>
);