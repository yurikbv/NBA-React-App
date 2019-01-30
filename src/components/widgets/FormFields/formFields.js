import React from 'react';
import './formFields.css';

const FormFields = ({formData, change, id}) => {

  const showError = () => {
    let erroeMessage = null;
    if(formData.validation && !formData.valid) {
      erroeMessage = (
        <div className='labelError'>
          {formData.validationMessage}
        </div>
      )
    }
    return erroeMessage;
  };

  const renderTemplate = () => {
    let formTemplate = null;
    switch (formData.element) {
      case 'input':
        formTemplate = (
          <div>
            <input
            {...formData.config}
            value={formData.value}
            onChange={event => change(event, id, {blur: false})}
            onBlur={event => change(event, id, {blur: true})}
            />
            {showError()}
          </div>
        );
        break;
      default:
        formTemplate = null;
        break;
    }
    return formTemplate;
  };

  return (
    <div>
      {renderTemplate()}
    </div>
  );
};

export default FormFields;
