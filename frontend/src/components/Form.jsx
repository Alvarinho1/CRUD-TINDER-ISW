import { useState, useEffect } from 'react';

const Form = ({ title, fields, buttonText, onSubmit, footerContent, backgroundColor }) => {
    const initialFormData = fields.reduce((acc, field) => {
        acc[field.name] = field.value || '';
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        const newFormData = fields.reduce((acc, field) => {
            acc[field.name] = field.value || '';
            return acc;
        }, {});
        setFormData(newFormData);
    }, [fields]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'cursos' || name === 'areasDeInteres') {
            setFormData({
                ...formData,
                [name]: value.split(',').map(item => item.trim()),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const requiredFields = fields.filter(field => field.required);
        for (let field of requiredFields) {
            if (!formData[field.name] || formData[field.name].length === 0) {
                alert('Por favor, completa todos los campos requeridos.');
                return;
            }
        }

        onSubmit(formData);
    };

    return (
        <form className="form" style={{ backgroundColor: backgroundColor }} onSubmit={handleSubmit}>
            <h1>{title}</h1>
            {fields.map((field, index) => (
                <div className="container_inputs" key={index}>
                    {field.label && <label htmlFor={field.name}>{field.label}</label>}
                    {field.type === 'text' ? (
                        <input
                            name={field.name}
                            placeholder={field.placeholder}
                            type="text"
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required={field.required}
                            disabled={field.disabled}
                        />
                    ) : field.type === 'select' ? (
                        <select
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required={field.required}
                            disabled={field.disabled}
                        >
                            <option value="" disabled>{field.placeholder || "Selecciona una opción"}</option>
                            {field.options.map((option, i) => (
                                <option key={i} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            name={field.name}
                            placeholder={field.placeholder}
                            type={field.type || "text"}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required={field.required}
                            disabled={field.disabled}
                        />
                    )}
                </div>
            ))}
            {buttonText && <button type="submit">{buttonText}</button>}
            {footerContent && <div>{footerContent}</div>}
        </form>
    );
};

export default Form;
