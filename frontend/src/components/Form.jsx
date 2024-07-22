import { useState } from 'react';

const Form = ({ title, fields, buttonText, onSubmit, footerContent, backgroundColor }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        
        // Convertir los campos de cursos y áreas de interés a arrays
        if (name === 'cursos' || name === 'areasDeInteres') {
            setFormData({
                ...formData,
                [name]: value ? value.split(',').map(item => item.trim()) : [], // Convertir a array
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
        if (!formData.carrera || !formData.genero) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
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
                        />
                    ) : field.type === 'select' ? (
                        <select
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required={field.required}
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
