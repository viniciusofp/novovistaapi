import React from "react";

const SelectArea = props => {
  const { onChange, value, name, label, options } = props;
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        id={name}
        className="form-control"
        onChange={onChange}
        value={value}
      >
        {options.map(option => (
          <option key={`option${name}${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectArea;
