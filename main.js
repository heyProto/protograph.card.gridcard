import React from 'react';
import ReactDOM from 'react-dom';
import GridCard from './src/js/Container.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toGrid = function () {
  this.cardType = 'toGridCard';
}

ProtoGraph.Card.toGrid.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toGrid.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toGrid.prototype.renderCol2= function (data) {
  this.mode = 'col2';
  ReactDOM.render(
    <GridCard
      dataURL={this.options.data_url}
      selector={this.options.selector}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      clickCallback={this.options.onClickCallback}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}