import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import BuscaImoveis from "./components/buscaImoveis";
import ImovelDetalhes from "./components/imovelDetalhes";

class App extends Component {
  render() {
    return (
      <div className="container">
        <Switch>
          <Route path="/imovel/:categoria/:codigo" component={ImovelDetalhes} />
          <Route path="/imoveis" component={BuscaImoveis} />
          <Route path="/" component={BuscaImoveis} />
        </Switch>
      </div>
    );
  }
}

export default App;
