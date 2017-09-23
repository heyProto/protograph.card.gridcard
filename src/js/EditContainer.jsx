import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ArticleCard from './Container.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class EditLinkCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {
        card_data: {},
        configs: {}
      },
      mode: "laptop",
      loading: true,
      publishing: false,
      uiSchemaJSON: {},
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    }
    this.toggleMode = this.toggleMode.bind(this);
  }

  exportData() {
    let getDataObj = {
      step: this.state.step,
      dataJSON: this.state.dataJSON.card_data,
      schemaJSON: this.state.schemaJSON,
      optionalConfigJSON: this.state.dataJSON.configs,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    getDataObj["name"] = getDataObj.dataJSON.data.title.substr(0,225); // Reduces the name to ensure the slug does not get too long
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (typeof this.props.dataURL === "string"){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL), axios.get(this.props.uiSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema, uiSchema) => {
          this.setState({
            dataJSON: {
              card_data: card.data,
              configs: opt_config.data
            }
          });
          axios.get('https://protograph.pykih.com/api/v1/iframely?url='+this.state.dataJSON.card_data.data.canonical)
            .then(data => {
              let obj = {};
              obj.data = data.data;
              this.setState({
                dataJSON:{
                  card_data: obj,
                  configs: opt_config.data
                },
                schemaJSON: schema.data,
                optionalConfigJSON: opt_config.data,
                optionalConfigSchemaJSON: opt_config_schema.data,
                uiSchemaJSON: uiSchema.data,
                loading: false
              })
            })
        }));
    }
  }

  onChangeHandler({formData}) {
    switch (this.state.step) {
      case 1:
        if (formData.data.canonical !== undefined){
          this.setState({
            loading: true
          })
          axios
            .get('https://protograph.pykih.com/api/v1/iframely?url='+formData.data.canonical)
            .then(response => {
              console.log(response, "response")
              this.setState((prevStep, prop) => {
                let dataJSON = prevStep.dataJSON;
                dataJSON.card_data = response;
                return {
                  dataJSON: dataJSON,
                  loading: false
                }
              })
            })
            .catch(function (error){
              console.log(error, "URL not found")
            })
        }
        break;
      case 2:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.configs = formData
          return {
            dataJSON: dataJSON
          }
        })
        break;
    }
  }

  onSubmitHandler({formData}) {
    switch(this.state.step) {
      case 1:
        this.setState({
          step: 2
        });
        break;
      case 2:
        if (typeof this.props.onPublishCallback === "function") {
          this.setState({ publishing: true });
          let publishCallback = this.props.onPublishCallback();
          publishCallback.then((message) => {
            this.setState({ publishing: false });
          });
        }
        break;
    }
  }

  renderSEO() {
    let seo_blockquote = `<blockquote><h3>${this.state.dataJSON.card_data.data.title}</h3><p>${this.state.dataJSON.card_data.data.description}</p></blockquote>`
    return seo_blockquote;
  }


  renderSchemaJSON() {
    // console.log(this.state.schemaJSON, "this.state.schemaJSON")
    switch(this.state.step){
      case 1:
        return this.state.schemaJSON;
        break;
      case 2:
        return this.state.optionalConfigSchemaJSON;
        break;
    }
  }

  renderFormData() {
    switch(this.state.step) {
      case 1:
        return this.state.dataJSON.card_data;
        break;
      case 2:
        return this.state.dataJSON.configs;
        break;
    }
  }

  showLinkText() {
    switch(this.state.step) {
      case 1:
        return '';
        break;
      case 2:
        return '< Back';
        break;
    }
  }

  showButtonText() {
    switch(this.state.step) {
      case 1:
        return 'Next';
        break;
      case 2:
        return 'Publish';
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    });
  }

  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');
    this.setState((prevState, props) => {
      let newMode;
      if (mode !== prevState.mode) {
        newMode = mode;
      } else {
        newMode = prevState.mode
      }
      return {
        mode: newMode
      }
    })
  }

  render() {
    if (this.state.schemaJSON === undefined) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    toArticle
                  </div>
                </div>
                <JSONSchemaForm schema={this.renderSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  formData={this.renderFormData()}
                  >
                  <a id="protograph-prev-link" className={`${this.state.publishing ? 'protograph-disable' : ''}`} onClick={((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
                  <button type="submit" className={`${this.state.publishing || this.state.loading ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'laptop' ? 'active' : ''}`}
                      data-mode='laptop'
                      onClick={this.toggleMode}
                    >
                      <i className="desktop icon"></i>
                    </a>
                    <a className={`item ${this.state.mode === 'mobile' ? 'active' : ''}`}
                      data-mode='mobile'
                      onClick={this.toggleMode}
                    >
                      <i className="mobile icon"></i>
                    </a>
                    <a className={`item ${this.state.mode === 'list' ? 'active' : ''}`}
                      data-mode='list'
                      onClick={this.toggleMode}
                    >
                      <i className="list icon"></i>
                    </a>
                  </div>
                </div>
                <ArticleCard
                  mode={this.state.mode}
                  dataJSON={this.state.dataJSON}
                  schemaJSON={this.state.schemaJSON}
                  optionalConfigJSON={this.state.optionalConfigJSON}
                  optionalConfigSchemaJSON={this.state.optionalConfigSchemaJSON}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}