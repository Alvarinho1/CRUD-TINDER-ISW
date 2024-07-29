import { useState, useEffect } from 'react';

const Form = ({ title, fields, buttonText, onSubmit, footerContent, backgroundColor }) => {
    // Inicializar formData con los valores iniciales de fields
    const initialFormData = fields.reduce((acc, field) => {
        acc[field.name] = field.value || ''; // Usar el valor inicial si está disponible
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        const updatedFormData = fields.reduce((acc, field) => {
            acc[field.name] = field.value || ''; // Usar el valor inicial si está disponible
            return acc;
        }, {});
        setFormData(updatedFormData);
    }, [fields]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'cursos' || name === 'areasDeInteres') {
            setFormData({
                ...formData,
                [name]: value.split(',').map(item => item.trim()), // Convertir a array manteniendo espacios dentro de cada item
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
                    <input
                        name={field.name}
                        placeholder={field.placeholder}
                        type={field.type}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required={field.required}
                        disabled={field.disabled} // Agregar la propiedad disabled
                    />
                </div>
            ))}
            {buttonText && <button type="submit">{buttonText}</button>}
            {footerContent && <div>{footerContent}</div>}
        </form>
    );
};

export default Form;