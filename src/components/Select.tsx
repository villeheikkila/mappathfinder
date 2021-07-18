import { capitalize } from "./../utils";
import React from "react";

interface Option {
    value: string
    label: string
}

interface SelectProps {
    options: Option[]
    selected?: string
}

export const Select = ({ options, selected, ...rest }: SelectProps & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>) => {
    return <select {...rest}>
        {options.map(({ value, label }) => (
            <option key={value} value={value} selected={value === selected}>
                {capitalize(label)}
            </option>
        ))}
    </select>
}