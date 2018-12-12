import React from "react";

const RadioGroup = props => {
  const { onClick, label, name, options, selectedRadio } = props;
  return (
    <div className="input-group">
      <p className="w-100">{label}</p>
      {options.map(option => (
        <div key={name + option.value} className="d-block">
          <label
            htmlFor={name + option.value}
            className={
              selectedRadio == option.value
                ? "btn btn-primary"
                : "btn btn-light"
            }
          >
            {option.label}
          </label>
          <input
            onClick={onClick(name)}
            name={name}
            type="radio"
            id={name + option.value}
            value={option.value}
            className="d-none"
          />
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;
