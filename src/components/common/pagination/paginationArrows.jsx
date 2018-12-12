import React from "react";

const PaginationArrows = props => {
  const getItemClass = p => {
    return currentPage === p ? "page-item active" : "page-item";
  };
  const { totalPages, currentPage, onPageChange } = props;
  return (
    <ul className="pagination justify-content-end">
      {currentPage > 2 && (
        <li className={getItemClass(0)}>
          <span className="page-link" onClick={() => onPageChange(1)}>
            <i className="fa fa-angle-double-left" />
          </span>
        </li>
      )}
      {currentPage > 1 && (
        <li className={getItemClass(0)}>
          <span
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
          >
            <i className="fa fa-angle-left" />
          </span>
        </li>
      )}
      {currentPage < totalPages && (
        <li className={getItemClass(0)}>
          <span
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
          >
            <i className="fa fa-angle-right" />
          </span>
        </li>
      )}
      {currentPage < totalPages - 1 && (
        <li className={getItemClass(0)}>
          <span className="page-link" onClick={() => onPageChange(totalPages)}>
            <i className="fa fa-angle-double-right" />
          </span>
        </li>
      )}
    </ul>
  );
};

export default PaginationArrows;
