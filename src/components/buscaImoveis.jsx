import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import PaginationNumbers from "./common/pagination/paginationNumbers";
import ImovelBuscaItem from "./imovelBuscaItem";
import Select from "./common/select";
import RadioGroup from "./common/radioGroup";
import Loading from "./common/loading";
import PaginationArrows from "./common/pagination/paginationArrows";
const queryString = require("query-string");

const baseUrl = "http://sandbox-rest.vistahost.com.br";
const key = "c9fdd79584fb8d369a6a579af1a8f681";
class BuscaImoveis extends Component {
  state = {
    loading: false,
    form: {
      AreaMin: 0,
      AreaMax: 0,
      Cidade: ""
    },
    cidades: [],
    imoveis: [],
    pagination: {},
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
      ],
      filter: {},
      advFilter: {
        Or: {
          ValorVenda: ["!=", 0],
          ValorLocacao: ["!=", 0]
        }
      },
      paginacao: {
        pagina: 1,
        quantidade: 6
      }
    }
  };

  componentDidMount() {
    const { pesquisa, form } = this.getStateFromQuery();
    this.setState({ pesquisa, form }, () => {
      this.getImoveis(pesquisa);
      this.getCampos();
    });
  }

  /**
   *
   * Api Calls
   *
   */

  getImoveis(queryObj) {
    this.setState({ loading: true }, async () => {
      let newQueryString =
        "/imoveis?pesquisa=" +
        JSON.stringify(this.state.pesquisa.filter) +
        "&pagina=" +
        this.state.pesquisa.paginacao.pagina;
      console.log(newQueryString);
      newQueryString = newQueryString
        .replace(/[áãâ]/g, "a")
        .replace(/[éê]/g, "e")
        .replace(/[í]/g, "i")
        .replace(/[óõô]/g, "o")
        .replace(/[ú]/g, "u");

      this.props.history.push(newQueryString);
      const apiUrl = baseUrl + "/imoveis/listar?showtotal=1&key=" + key;
      const pesquisa = queryObj;
      const query = "&pesquisa=" + JSON.stringify(pesquisa);
      const imoveisCall = await axios.get(apiUrl + query, {
        headers: {
          accept: "application/json"
        }
      });
      const data = imoveisCall.data;
      const imoveis = _.values(data).filter(i => _.has(i, "Codigo"));
      const meta = _.pick(data, ["paginas", "pagina", "quantidade", "total"]);
      this.setState({ imoveis, pagination: meta, loading: false });
    });
  }
  async getCampos() {
    const apiUrl = baseUrl + "/imoveis/listarConteudo?key=" + key;
    const pesquisa = {
      fields: ["Cidade"]
    };
    const query = "&pesquisa=" + JSON.stringify(pesquisa);
    const camposCall = await axios.get(apiUrl + query, {
      headers: { accept: "application/json" }
    });
    const cidades = camposCall.data.Cidade;
    const cidadeOptions = [];
    cidades.map(cidade => {
      const cidadeObj = { value: cidade, label: cidade };
      cidadeOptions.push(cidadeObj);
    });
    this.setState({ cidades: cidadeOptions });
  }

  /**
   *  Transforms URL params into JavaScript objects
   *
   * @returns pesquisa {object}, form {object}
   * @memberof BuscaImoveis
   */
  getStateFromQuery() {
    const pesquisa = { ...this.state.pesquisa };
    const form = { ...this.state.form };
    const queryPath = this.props.location.search.slice(1).split("&");
    const queryObj = queryPath
      .filter(p => p.indexOf("pesquisa=") !== -1 || p.indexOf("pagina=") !== -1)
      .map(p => {
        if (p.indexOf("pesquisa=") !== -1) {
          const string = p.replace("pesquisa=", "");
          return ["pesquisa", JSON.parse(unescape(string))];
        } else if (p.indexOf("pagina=") !== -1) {
          const string = p.replace("pagina=", "");
          return ["pagina", JSON.parse(unescape(string))];
        }
      });
    const searchObj = _.fromPairs(queryObj);
    if (_.has(searchObj, "pesquisa")) {
      pesquisa.filter = searchObj.pesquisa;
      searchObj.pesquisa.Cidade !== undefined &&
        (form.Cidade = searchObj.pesquisa.Cidade);
      searchObj.pesquisa.Dormitorios !== undefined &&
        (form.Dormitorios = searchObj.pesquisa.Dormitorios[1]);
      searchObj.pesquisa.Vagas !== undefined &&
        (form.Vagas = searchObj.pesquisa.Vagas[1]);
      if (searchObj.pesquisa.AreaTotal !== undefined) {
        if (searchObj.pesquisa.AreaTotal[0] === ">=") {
          form.AreaMin = searchObj.pesquisa.AreaTotal[1];
        } else if (searchObj.pesquisa.AreaTotal[0] == "<=") {
          form.AreaMax = searchObj.pesquisa.AreaTotal[1];
        } else if (!isNaN(searchObj.pesquisa.AreaTotal[0])) {
          form.AreaMin = searchObj.pesquisa.AreaTotal[0];
          form.AreaMax = searchObj.pesquisa.AreaTotal[1];
        }
      }
    }
    if (_.has(searchObj, "pagina"))
      pesquisa.paginacao.pagina = searchObj.pagina;
    return { pesquisa, form };
  }

  /**
   *
   * User Interface Handlers
   *
   */
  handlePageChange = p => {
    this.props.history.push("/hello");
    const pesquisa = { ...this.state.pesquisa };
    pesquisa.paginacao.pagina = p;
    this.getImoveis(pesquisa);
    this.setState({ pesquisa });
  };
  handleAreaMin = e => {
    const pesquisa = { ...this.state.pesquisa };
    const form = { ...this.state.form };
    form.AreaMin = e.currentTarget.value;
    pesquisa.paginacao.pagina = 1;
    if (form.AreaMax > form.AreaMin) {
      pesquisa.filter.AreaTotal = [form.AreaMin, form.AreaMax];
    } else {
      form.AreaMax = 0;
      pesquisa.filter.AreaTotal = [">=", form.AreaMin];
    }
    this.getImoveis(pesquisa);
    this.setState({ pesquisa, form });
  };
  handleAreaMax = e => {
    const pesquisa = { ...this.state.pesquisa };
    const form = { ...this.state.form };
    form.AreaMax = e.currentTarget.value;
    pesquisa.paginacao.pagina = 1;
    if (form.AreaMin > 0 && form.AreaMin < form.AreaMax) {
      pesquisa.filter.AreaTotal = [form.AreaMin, form.AreaMax];
    } else if (form.AreaMax == 0 && form.AreaMin >= form.AreaMax) {
      form.AreaMin = 0;
      delete pesquisa.filter.AreaTotal;
    } else {
      form.AreaMin = 0;
      pesquisa.filter.AreaTotal = ["<=", form.AreaMax];
    }
    this.getImoveis(pesquisa);
    this.setState({ pesquisa, form });
  };
  handleCidade = e => {
    const pesquisa = { ...this.state.pesquisa };
    const form = { ...this.state.form };
    form.Cidade = e.currentTarget.value;
    pesquisa.filter.Cidade = form.Cidade;
    pesquisa.paginacao.pagina = 1;
    if (form.Cidade === "") {
      delete pesquisa.filter.Cidade;
      delete form.Cidade;
    }
    this.getImoveis(pesquisa);
    this.setState({ pesquisa, form });
  };
  handleRadio = field => e => {
    const pesquisa = { ...this.state.pesquisa };
    const form = { ...this.state.form };
    pesquisa.paginacao.pagina = 1;
    if (form[field] == e.currentTarget.value) {
      delete form[field];
      delete pesquisa.filter[field];
    } else {
      form[field] = e.currentTarget.value;
      pesquisa.filter[field] = [">=", form[field]];
    }
    this.getImoveis(pesquisa);
    this.setState({ pesquisa, form });
  };
  handleCleanFilters() {
    const pesquisa = { ...this.state.pesquisa };
    const form = {
      AreaMin: 0,
      AreaMax: 0,
      Cidade: ""
    };
    pesquisa.filter = {};
    pesquisa.paginacao = {
      pagina: 1,
      quantidade: 6
    };
    this.getImoveis(pesquisa);
    this.setState({ pesquisa, form });
  }

  /**
   *
   * Render Component
   *
   */
  render() {
    const { paginas, pagina, quantidade, total } = this.state.pagination;
    const areaOptions = [
      { value: 0, label: "" },
      { value: 100, label: "100m²" },
      { value: 200, label: "200m²" },
      { value: 300, label: "300m²" },
      { value: 400, label: "400m²" },
      { value: 500, label: "500m²" },
      { value: 600, label: "600m²" }
    ];
    const dormitoriosOptions = [
      { value: 1, label: "1+" },
      { value: 2, label: "2+" },
      { value: 3, label: "3+" },
      { value: 4, label: "4+" },
      { value: 5, label: "5+" }
    ];
    return (
      <React.Fragment>
        <div className="row pt-5">
          <div className="col-lg-3">
            <form>
              <Select
                value={this.state.form.Cidade}
                onChange={this.handleCidade}
                name="cidade"
                label="Cidade"
                options={this.state.cidades}
              />
              <Select
                value={this.state.form.AreaMin}
                onChange={this.handleAreaMin}
                name="minArea"
                label="Área Mínima"
                options={areaOptions}
              />
              <Select
                value={this.state.form.AreaMax}
                onChange={this.handleAreaMax}
                name="maxArea"
                label="Área Máxima"
                options={areaOptions}
              />
              <RadioGroup
                onClick={this.handleRadio}
                name="Dormitorios"
                label="Dormitórios"
                options={dormitoriosOptions}
                selectedRadio={this.state.form.Dormitorios}
              />
              <RadioGroup
                onClick={this.handleRadio}
                name="Vagas"
                label="Vagas"
                options={dormitoriosOptions}
                selectedRadio={this.state.form.Vagas}
              />
              <div
                className="btn btn-sm btn-outline-secondary my-3"
                onClick={() => this.handleCleanFilters()}
              >
                Limpar filtros <i className="fa fa-times ml-2" />
              </div>
            </form>
          </div>
          <div className="col-lg-9">
            <PaginationArrows
              totalPages={paginas}
              currentPage={pagina}
              onPageChange={this.handlePageChange}
            />
            {this.state.loading && <Loading />}
            <div className="row">
              {this.state.imoveis.map(imovel => (
                <div className="col-md-6" key={imovel.Codigo}>
                  <ImovelBuscaItem imovel={imovel} />
                </div>
              ))}
            </div>
            <PaginationNumbers
              totalPages={paginas}
              currentPage={pagina}
              onPageChange={this.handlePageChange}
              perPage={quantidade}
              totalItems={total}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BuscaImoveis;
