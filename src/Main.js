import React, { Component } from "react";
import Panel from "./Panel";
import Web3 from 'web3';
import AirlineContract from './airline';

export class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: undefined
        }
    }

    async componentDidMount() {
        let web3 = new Web3(window.web3.currentProvider);
        let airline = await AirlineContract(web3.currentProvider);

        console.log(airline.buyFlight);

        var account = (await web3.eth.getAccounts())[0];
        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.load();
        });
    }

    async load() {
        return;
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">

                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">


                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">

                    </Panel>
                </div>
            </div>
        </React.Fragment>
    }
}