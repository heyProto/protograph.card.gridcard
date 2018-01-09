import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ta from 'time-ago';
export default class toGridCard extends React.Component {
  constructor(props) {
    super(props)
    console.log("Hell");
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      schemaJSON: undefined,
      linkDetails: undefined,
      domain: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    };
    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.schemaJSON) {
      stateVar.schemaJSON = this.props.schemaJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if (this.props.optionalConfigSchemaJSON) {
      stateVar.optionalConfigSchemaJSON = this.props.optionalConfigSchemaJSON;
    }
    if(this.props.linkDetails){
      stateVar.linkDetails = this.props.linkDetails;
    }
    if(this.props.domain){
      stateVar.domain = this.props.domain;
    }
    if(this.props.houseColors){
      stateVar.optionalConfigJSON.house_color = this.props.houseColors.house_color;
      stateVar.optionalConfigJSON.inverse_house_color = this.props.houseColors.inverse_house_color;
      stateVar.optionalConfigJSON.house_font_color = this.props.houseColors.house_font_color;
      stateVar.optionalConfigJSON.inverse_house_font_color = this.props.houseColors.inverse_house_font_color;
    }
    this.state = stateVar;
  }

  componentDidMount() {
    if (this.state.fetchingData){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema) => {
          this.setState({
            fetchingData: false,
            dataJSON: card.data,
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data
          });
        }));
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }
  exportData() {
    return document.getElementById('protograph_div').getBoundingClientRect();
  }

  renderCol2(){
    if(!this.state.schemaJSON){
      return(
        <div>Loading</div>
      )
    }else{
      console.log(this.state,'.....');
      return(
        <div id="protograph_div" className="col-2-grid-card">
          <div className="col-2-bgimage">
            <img className="col-2-image" src={this.state.dataJSON.data.image_url}/>
          </div>
          <div className="col-2-name">
            {this.state.dataJSON.data.name}
          </div>
        </div>
      )
    }
  }
  render() {
    switch(this.props.mode) {
      case 'col2':
        return this.renderCol2();
    }
  }
}