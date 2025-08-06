import { useState } from 'react';

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const reset = () => setValues(initialValues);

  return { values, handleChange, reset };
};

export default useForm;
