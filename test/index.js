import React from 'react';
import ReactDOM from 'react-dom/client';
import ActionTable from '../src';
import faker from '@faker-js/faker';
import PtBr from '../src/lang/PtBr';
import { Desktop, Icon } from 'react-fenestra';

import "bootstrap/dist/css/bootstrap.css";
import "react-fenestra/dist/css/fenestra.css";
import "../src/css/actiontable.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faWindowRestore } from '@fortawesome/free-solid-svg-icons';

const root = ReactDOM.createRoot(document.getElementById('root'));

const newRecord = () => ({
  columns: [
    faker.name.findName(),
    faker.internet.email(),
    faker.address.streetAddress(),
    faker.random.word()
  ],
  actions: [
    {title: "Editar", params: {id: faker.random.numeric(), url: faker.internet.url(), desc: "Parâmetros personalizados"}},
    {title: "Excluir", params: {id: faker.random.numeric(), url: faker.internet.url(), desc: "Parâmetros personalizados"}}
  ]
});

const data = {
  //headers: ["Name", "Email", "Address", "Status"],
  rows: new Array(500).fill(undefined).map(newRecord)
}

const Table = ({data, endpoint}) =>
  <ActionTable
    lang={PtBr}
    data={data}
    endpoint={endpoint}
    onAction={action => {
      window.alert("Ação executada: " + JSON.stringify(action));
    }}
    onNewRecordClick={update => {
      data.rows.push(newRecord());
      update();
    }} />

const icons = [
  ({fenestra}) => <Icon title="Conteúdo Estático" icon={<FontAwesomeIcon icon={faWindowRestore} size="3x" />} onClick={() => fenestra.open({
      title: "Conteúdo Estático",
      width: 960, height: 600,
      content: () => <><h1>Lista de Exemplo com fonte local</h1><Table data={data}/></>
    })} />,
    ({fenestra}) => <Icon title="Conteúdo Dinâmico" icon={<FontAwesomeIcon icon={faWindowRestore} size="3x" />} onClick={() => fenestra.open({
      title: "Conteúdo Dinâmico",
      width: 960, height: 600,
      content: () => <Table endpoint="http://actiontable.free.beeceptor.com"/>
    })} />
]

root.render(
  <React.StrictMode>
    <Desktop icons={icons} />
  </React.StrictMode>
);