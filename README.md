
# Introdução
## react-actiontable
Componente React para visualização de dados em tabela. Possui suporte a paginação, busca, registros por página e fonte remota de dados.
Permite a customização de ações para cada um dos registros retornados pelo endpoint ou da propriedade _data_. É baseado
em Bootstrap 4, Superagent e FontAwesome.

## Live Preview
_[Clique para acessar o preview](https://alfredogaliza.github.io/react-actiontable/public/)_
    
# Instalação
Via NPM:
```
npm install react-actiontable
```

# Utilização
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import ActionTable from 'react-actiontable';

import "bootstrap/dist/css/bootstrap.css";
import "react-actiontable/dist/css/actiontable.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ActionTable 
      endpoint="http://actiontable.free.beeceptor.com"
      data={ data }
    />
  </React.StrictMode>
);
```

# API
## \<ActionTable \/\>
Renderiza uma tabela para visualização e controle dos dados.

|Propriedade | Tipo  |Valor Padrão|Detalhes|
|-----|-------|------------|--------|
|data| Object \| Array | undefined | Objeto que possui os detalhes dos registros a serem exibidos|
|data.headers | Array | [] | Lista de Cabeçalhos para os registros |
|data.headers[].title | String | "Coluna n" | Nome da coluna referente ao cabeçalho|
|data.headers[].order | String | header.title | valor do parâmetro _order_, quando utilizada a utilização de fonte remota de dados |
| data.rows | Array | [ ] | Lista de Registros que serão gerenciados pela Action Table. |
| data.rows[].columns | Array | [ ] | Valores das colunas definidos na mesma sequência dos cabeçalhos |
| data.rows[].actions | Array | [ ] | Lista ações definidas para o registro |
| data.rows[].actions[] | String \| Object | (vazio) | Definição da ação a ser executada. Esta definição é repassada no callback _onAction_ quando acionada |
| data.rows[].actions[].title | String | | data.rows[].actions[].toString() | Título da ação |
| data.count | Number | data.rows.length | Quantidade total de registros, considerando a filtragem e desconsiderando a paginação. Este parâmetro é utilizado para cálculo do número de páginas |
| endpoint | String \| Object | undefined | Definição da fonte remota de dados |
| endpoint.url | String | endpoint | Endereço da fonte de dados |
| endpoint.method | String | "get" | Método de busca HTTP dos dados |
|lang | Object | ActiveTable.EnUs | Strings da interface |
|getHeaders | Function | () => null | Obtém os parâmetros do cabeçalho para requição dos dados do endpoint. Útil quando é necessária a autenticação via JWT |
| mapStateToParams | Function | ({limit = 0, offset = 0, filter = '', order = '', dir = 'ASC\|DESC'}) => reqParams | Obtém os parâmetros da query para busca dos dados na fonte remota |
| mapResponseToData | Function | response => response.body | Obtém o mapeamento da resposta do endpoint para formação do objeto _data_ |
| onError | Function | error => undefined | Callback chamado em caso de erro na busca dos dados |
| onAction | Function | (action, update) => undefined | Callback chamado no momento do acionamento da Ação. O parâmetro _update_ pode ser chamado assincronamente para atualização dos dados da tabela |
| onUpdate | Function | data => undefined | Callback chamado quando a tabela é atualizada |
| onNewRecordClick | Function | (update) => undefined | Se configurado, habilita o botão de criação de novo registro. O usuário deverá realizar a inclusão dos dados (no backend ou frontend) e então chamar assincronamente a função _update_ para atualização dos dados da tabela|
| toolsPosition | String | "top" \| "bottom" \| "both" \| "none", Padrão: "top" | Configura a exibição da barra de filtro, limite, paginação e inclusão de registros |

# Exemplos
## Exemplos Mínimos
### Dados Estáticos
```js
/* ... */
const data = [
 "Banana", "Laranja", "Limão", /* ... */
]
/* ... */
<ActionTable data={data} />
/* ... */
```
### Dados Remotos
```js
/* ... */
const endpoint = "http://myendpoint.com";
/* ... */
<ActionTable endpoint={endpoint} onUpdate={data => console.log(data)} />
/* ... */
```

## Exemplo Completo
```js
/* ... */
const data = {
  headers: [
    {
      title: "Nome",
      order: "nome"
    },
    {
      title: "E-mail",
      order: "email"
    }
  ],
  rows: [
    {
      columns: [
        "Harvey Auer DVM", "Glen.Gislason@hotmail.com"
      ]
      actions: [
        {
          title: "Edit",
          id: 1 //Parâmetro personalizado
        },
        {
          title: "Delete",
          id: 1 //Parâmetro personalizado
        }
      ]
    },
    /* ... */
  ]
  count: 99
}
/* ... */
<ActionTable 
  data={data} 
  onAction={(action, update) => asyncAction(action).then(update)}
  getActionButtonComponent={action => props => <button {...props}>{action.title}</button>}
 />
/* ... */
```


# Licença
MIT

# Autor
## Luiz Alfredo Galiza <alfredogaliza@gmail.com>
Engenheiro da Computação formado pela Universidade Federal do Pará, trabalha há mais de 20 anos na área de programação. É oficial do Corpo de Bombeiros Militar e atualmente coordena a equipe de desenvolvimento de sistemas da Secretaria de Segurança Pública do Pará.