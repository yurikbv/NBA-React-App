import React, {Component} from 'react';
import { firebaseTeams, firebaseArticles, firebase, firebaseDB } from '../../firebase';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState} from 'draft-js';
import { stateToHTML } from "draft-js-export-html";
import Uploader from '../widgets/FileUploader/fileUploader';


import './dashboard.css';
import FormField from '../widgets/FormFields/formFields';


class Dashboard extends Component {

  state = {
    editorState: EditorState.createEmpty(),
    postError: '',
    loading: false,
    formData: {
      author: {
        element: 'input',
        value: '',
        config: {
          name: 'author_input',
          type: 'text',
          placeholder: 'Enter your name'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      title: {
        element: 'input',
        value: '',
        config: {
          name: 'title_input',
          type: 'text',
          placeholder: 'Title'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      body: {
        element: 'texteditor',
        value: '',
        valid: true
      },
      image: {
        element: 'image',
        value: '',
        valid: true
      },
      team: {
        element: 'select',
        value: '',
        config: {
          name: 'teams_input',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      }
    }
  };

  componentDidMount() {
    this.loadTeams();
  }

  loadTeams = () => {
    firebaseTeams.once('value')
      .then(snapshot => {
        let teams = [];
        snapshot.forEach((childSnapshot) => {
          teams.push({
            id: childSnapshot.val().id,
            name: childSnapshot.val().city,
          })
        });

        let newFormData = {...this.state.formData};
        let newElement = {...newFormData['team']};
        newElement.config.options = teams;
        newFormData['team'] = newElement;
        this.setState({
          formData: newFormData
        })
      })
  };

  updateForm = (event, id, blur ,content='') => {
    const newFormData = {
      ...this.state.formData
    };
    const newElement = {
      ...newFormData[id]
    };
    if(content=== ''){
      newElement.value = event.target.value;
    } else newElement.value = content;

    if(blur){
      let validData = this.validate(newElement);
      newElement.valid = validData[0];
      newElement.validationMessage = validData[1];
    }
    if(blur !== null) newElement.touched = blur;
    newFormData[id] = newElement;
    this.setState({
      formData: newFormData
    })
  };

  validate = (element) => {
    let error = [true,''];
    if(element.validation.required){
      const valid = element.value.trim() !== '';
      const message = `${!valid ? 'This field is required' : ''}`;
      error = !valid ? [valid, message] : error;
    }
    return error;
  };

  addLinkId = (id, place) => {
    firebaseDB.ref(`/${place}/${id}`).update({
      linkId: id
    })
  };

  submitForm = (event) => {
    event.preventDefault();
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
        postError: '',
        loading: true
      });
      firebaseArticles.orderByChild('id')
        .limitToLast(1).once('value')
        .then(snapshot => {
          let articleId = null;
          snapshot.forEach(childSnapshot => {
            articleId = childSnapshot.val().id;
          });
          dataToSubmit['date'] = firebase.database.ServerValue.TIMESTAMP;
          dataToSubmit['id'] = articleId + 1;
          firebaseArticles.push(dataToSubmit)
            .then(article => {
              this.addLinkId(article.key,'articles');
              this.props.history.push(`/articles/${article.key}`)
            }).catch(e => {
              this.setState({postError: e.message})
          });
        })
    } else {
      this.setState({
        postError: 'Something went wrong.',
        loading: false
      })
    }
  };

  submitButton = () => (
    this.state.loading ?
      'loading...' :
      <div>
        <button type='submit'>Add Post</button>
      </div>
  );

  showError = () => (
    this.state.postError !== ''
      ? <div className="post__error">{this.state.postError}</div> : null
  );

  onEditorStateChange = (editorState) => {

    let contentState = editorState.getCurrentContent();
    // let rawState = convertToRaw(contentState);
    let html = stateToHTML(contentState);

    this.updateForm(null, 'body',null,html);

    this.setState({
      editorState
    })
  };

  storeFilename = (filename) => {
    this.updateForm(null, 'image',null,filename)
  };

  render() {
    return (
      <div className="post__container">
        <form onSubmit={this.submitForm}>
          <h2>Add Post</h2>

          <Uploader filename={this.storeFilename}/>

          <FormField
            id='author'
            formData={this.state.formData.author}
            change={this.updateForm}
          />
          <FormField
            id='title'
            formData={this.state.formData.title}
            change={this.updateForm}
          />

          <Editor
            editorState={this.state.editorState}
            wrapperClassName="myEditor-wrapper"
            editorClassName="myEditor-editor"
            onEditorStateChange={this.onEditorStateChange}
          />

          <FormField
            id='team'
            formData={this.state.formData.team}
            change={this.updateForm}
          />
          {this.submitButton()}
          {this.showError()}
        </form>
      </div>
    );
  }
}

export default Dashboard;