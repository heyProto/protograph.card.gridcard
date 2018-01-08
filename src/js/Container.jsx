import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ta from 'time-ago';
export default class toGridCard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {
        card_data: {},
        configs: {}
      },
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
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL), axios.get(window.ref_link_sources_url)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema, links) => {
          this.setState({
            fetchingData: false,
            dataJSON: {
              card_data: card.data,
              configs: opt_config.data
            },
            linkDetails:links.data,
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data
          });
        }));
    }
  }


  exportData() {
    return this.props.selector.getBoundingClientRect();
  }
  checkURL(url){
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (!re.test(url)) {
        return false;
    }
    return true;
  }
  calculateDateTime() {
    const data = this.state.dataJSON.card_data;
    let date_split, date_split_by_hyphen, new_date, month, time;
      date_split = data.data.date.split("T")[0],
      date_split_by_hyphen = date_split.split("-"),
      new_date = new Date(date_split),
      month = new_date.toLocaleString("en-us", { month: "short" }),
      time = data.data.date.split("T")[1];
    let is_am_pm_split = time.split(":"), am_pm;
    if (is_am_pm_split[0] < "12"){
      am_pm = "am"
    } else {
      am_pm = "pm"
    }

    return {
      month: month,
      am_pm: am_pm,
      date: date_split_by_hyphen,
      time: time
    }
  }

  handleClick(){
    console.log(this.state);
    window.open(this.state.dataJSON.card_data.data.url,'_blank');
  }

  renderTwoCol(){
    if(!this.state.schemaJSON){
      return(
        <div>Loading</div>
      )
    }else{
      return(
        <div className="col-2-grid-card">
          <div className="col-2-bgimage">
            <img className="col-2-image" src={this.state.dataJSON.card_data.data.image_url}/>
          </div>
          <div className="col-2-name">
            {this.state.dataJSON.card_data.data.name}
          </div>
        </div>
      )
    }
  }
  render() {
    switch(this.props.mode) {
      case '2_col':
        return this.renderTwoCol();
    }
  }
}