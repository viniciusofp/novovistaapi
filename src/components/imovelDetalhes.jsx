import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import getDistanceFromLatLonInKm from "./common/coordinatesCalculation";

const baseUrl = "http://sandbox-rest.vistahost.com.br";
const key = "c9fdd79584fb8d369a6a579af1a8f681";

class ImovelDetalhes extends Component {
  state = {
    imovel: {},
    pesquisa: {
      fields: [
        "Bairro",
        "Cidade",
        "ValorVenda",
        "ValorLocacao",
        "Moeda",
        "Caracteristicas",
        "Categoria",
        "FotoDestaquePequena",
        "Status",
        "Dormitorios",
        "Vagas",
        "AreaTotal",
        "Latitude",
        "Longitude"
      ]
    }
  };
  async getImovel(queryObj) {
    const apiUrl = baseUrl + "/imoveis/detalhes?&key=" + key;
    const pesquisa = queryObj;
    const query =
      "&imovel=" +
      this.props.match.params.codigo +
      "&pesquisa=" +
      JSON.stringify(pesquisa);
    const imoveisCall = await axios.get(apiUrl + query, {
      headers: {
        accept: "application/json"
      }
    });
    const imovel = imoveisCall.data;

    this.setState({ imovel });
  }
  componentDidMount() {
    this.getImovel(this.state.pesquisa);
  }
  render() {
    const { imovel } = this.state;
    const coord = {
      lat: parseFloat(imovel.Latitude),
      lon: parseFloat(imovel.Longitude)
    };
    const d = getDistanceFromLatLonInKm(coord, {
      lat: -23.576668,
      lon: -46.629294
    });
    console.log(d);
    return (
      <div>
        <button className="btn btn-primary" onClick={this.props.history.goBack}>
          <i className="fa fa-arrow-left mr-2" />
          Voltar
        </button>
        <h1>
          {imovel.Categoria} - {imovel.Bairro}
        </h1>
        <div>
          <p>
            <i className="fa fa-bed mr-2" />
            Dormitórios: {imovel.Dormitorios}
          </p>
          <p>
            <i className="fa fa-car mr-2" />
            Vagas: {imovel.Vagas}
          </p>
          <p>
            <i className="fa fa-map-o mr-2" />
            Área: {Math.ceil(imovel.AreaTotal)}m²
          </p>
        </div>
        {d} km
      </div>
    );
  }
}

export default ImovelDetalhes;
