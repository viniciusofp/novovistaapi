import React from "react";
import { Link } from "react-router-dom";

const ImovelBuscaItem = props => {
  const { imovel } = props;
  return (
    <div key={imovel.Codigo}>
      <Link to={`/imovel/${imovel.Categoria}/${imovel.Codigo}`}>
        <h5>
          {imovel.Categoria} - {imovel.Bairro} <small>/ {imovel.Cidade}</small>
        </h5>
      </Link>
      <div>
        <p>
          <i className="fa fa-bed mr-2" />
          Dormitórios: {imovel.Dormitorios}{" "}
        </p>
        <p>
          <i className="fa fa-car mr-2" />
          Vagas: {imovel.Vagas}{" "}
        </p>
        <p>
          <i className="fa fa-map-o mr-2" />
          Área: {Math.ceil(imovel.AreaTotal)}m²
        </p>
      </div>
      {imovel.ValorVenda > 0 && (
        <p>
          <span className="badge badge-secondary mr-2">Venda</span>
          {imovel.Moeda}
          {imovel.ValorVenda}
        </p>
      )}
      {imovel.ValorLocacao > 0 && (
        <p>
          <span className="badge badge-secondary mr-2">Locação</span>
          {imovel.Moeda}
          {imovel.ValorLocacao}
        </p>
      )}
    </div>
  );
};

export default ImovelBuscaItem;
