import React, {Component} from 'react';
import { firebase } from '../../firebase';

import './signin.css';
import FormField from '../widgets/FormFields/formFields';

class SignIn extends Component {

  state = {
    registerError: '',
    loading: false,
    formData: {
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email_input',
          type: 'email',
          placeholder: 'Enter your email'
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      password: {
        element: 'input',
        value: '',
        config: {
          name: 'password_input',
          type: 'password',
          placeholder: 'Enter your password'
        },
        validation: {
          required: true,
          password: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      }
    }
  };

  validate = (element) => {
    let error = [true,''];
    if(element.validation.password){
      const valid = element.value.length >= 5;
      const message = `${!valid ? 'Must be greater than 5' : ''}`;
      error = !valid ? [valid, message] : error;
    }
    if(element.validation.email){
      const valid = /\S+@\S+\.\S+/.test(element.value);
      const message = `${!valid ? 'Must be a valid email' : ''}`;
      error = !valid ? [valid, message] : error;
    }
    if(element.validation.required){
      const valid = element.value.trim() !== '';
      const message = `${!valid ? 'This field is required' : ''}`;
      error = !valid ? [valid, message] : error;
    }
    return error;
  };

  updateForm = (event,id, {blur} ) => {
    const newFormData = {
      ...this.state.formData
    };
    const newElement = {
      ...newFormData[id]
    };
    newElement.value = event.target.value;

    if(blur){
      let validData = this.validate(newElement);
      newElement.valid = validData[0];
      newElement.validationMessage = validData[1];
    }
    newElement.touched = blur;
    newFormData[id] = newElement;
    this.setState({
      formData: newFormData
    })
  };

  submitForm = (event, type) => {
    event.preventDefault();
    if(type !== null) {
      let dataToSubmit = {};
      let formIsValid = true;

      for (let key in this.state.formData){
        dataToSubmit[key] = this.state.formData[key].value;
      }

      for (let key in this.state.formData){
        formIsValid = this.state.formData[key].valid && formIsValid;
      }

      if(formIsValid) {
        this.setState({
          loading: true,
          registerError: ''
        });
        if(type){
          firebase.auth()
            .signInWithEmailAndPassword(dataToSubmit.email,dataToSubmit.password)
            .then(() => {
              this.props.history.push('/')
            })
            .catch(error => {
              this.setState({
                loading: false,
                registerError: error.message
              });
            })
        } else {
          firebase.auth()
            .createUserWithEmailAndPassword(dataToSubmit.email,dataToSubmit.password)
            .then(() => {
              this.props.history.push('/')
            })
            .catch(error => {
              this.setState({
                loading: false,
                registerError: error.message
              });
            })
        }
      }

    }
  };

  submitButton = () => (
    this.state.loading ?
      'loading...' :
      <div>
        <button onClick={event => this.submitForm(event,false)}>Register Now</button>
        <button onClick={event => this.submitForm(event,true)}>Log in</button>
      </div>
  );

  showError = () => (
    this.state.registerError !== ''
      ? <div className="register__error">{this.state.registerError}</div> : null
  );

  render() {
    return (
      <div className='logContainer'>
        <form onSubmit={event => this.submitForm(event,null)}>
          <h2>Register / Log in</h2>
          <FormField
            id='email'
            formData={this.state.formData.email}
            change={this.updateForm}
          />
          <FormField
            id='password'
            formData={this.state.formData.password}
            change={this.updateForm}
          />
          {this.submitButton()}
          {this.showError()}
        </form>
      </div>
    );
  }
}

export default SignIn;