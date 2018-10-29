import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import CSVReader from "react-csv-reader";
import "./App.css";

var amazon = require("amazon-product-api");

var client = amazon.createClient({
  awsId: "aws ID",
  awsSecret: "aws Secret",
  awsTag: "aws Tag"
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      keys: ["UPC"]
    };
  }

  formatKeys = keys => {
    keys.map(key => {
      let obj = {
        Header: key,
        accessor: key,
        filterMethod: (filter, row) => {
          return row[filter.id]
            .toLowerCase()
            .includes(filter.value.toLowerCase())
            ? true
            : false;
        }
      };
      return obj;
    });
    return [
      {
        Header: "Items",
        columns: keys
      }
    ];
  };

  handleFile = (file, fileName) => {
    file.forEach(upc => {
      this.getUpcData(upc);
    });
  };

  handleError = error => {};

  getUpcData(upc) {
    client
      .itemLookup({
        idType: "UPC",
        itemId: upc
      })
      .then(function(results) {
        console.log(JSON.stringify(results));
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  render() {
    let keys = this.formatKeys(this.state.keys);
    return (
      <div className="App">
        <div>
          <CSVReader
            cssClass="csv-input"
            label="Select UPC file"
            onFileLoaded={this.handleFile}
            onError={this.handleError}
            inputId="ObiWan"
            inputStyle={{ color: "red" }}
          />
        </div>
        <ReactTable
          data={this.state.data}
          columns={keys}
          filterable
          className="-highlight -striped"
        />
      </div>
    );
  }
}

export default App;
