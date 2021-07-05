import React, { Component } from "react";
import Panel from "./Panel";
import Web3 from 'web3';
import AirlineContract from './airline';
import { AirlineService } from './airlineService'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(),'ether');
    }
}

export class Main extends Component {    
    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            account: undefined,
            flights: [],
            customerFlights: [],
            refundableEther: 0
        }
    }

    async componentDidMount() {
        this.web3 = new Web3(window.web3.currentProvider);
        this.toEther = converter(this.web3);
        this.airline = await AirlineContract(this.web3.currentProvider);
        this.airlineService = new AirlineService(this.airline);

        // this.web3.currentProvider._publicConfigStore.on('update', async function(event) {
        //     this.setState({
        //         account: event.selectedAddress.toLowerCase()
        //     }, () => {
        //         this.load();
        //     });
        // }.bind(this));

        var account = (await this.web3.eth.getAccounts())[0];
        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.load();
        });

        let flightPurchased = this.airline.FlightPurchased();
        flightPurchased.watch(function (err,result) {
            const { customer, flight, price } = result.args;
            
            if(customer === this.state.account) {
                console.log(`Your purchased a flight to ${flight} with a cost to ${price}`);
            } else {
                toast(`Your purchased a flight to ${flight} with a cost to ${price}`);
            }
        }.bind(this));

        setInterval(async () => {
            var newAccount = await this.web3.eth.getAccounts();
            this.setState({
                account: newAccount[0].toLowerCase()
            }, () => {
                this.load();
            });
        },1000);
    }


    async getBalance() {
        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        this.setState({
            balance: this.toEther(weiBalance)
        });
    }

    async getFlights() {
        let flights = await this.airlineService.getFlights();
        this.setState({
            flights: flights
        });
    }

    async buyFlight(index,flight) {
        const { cost } = flight;
        this.airlineService.buyFlight(index,this.state.account,cost);
    }

    async getCustomerFlights() {
        const customerFlights = await this.airlineService.getCustomerFlights(this.state.account);
        this.setState({
            customerFlights: customerFlights
        });
    }

    async getRefundableEther() {
        const refundableEther = (await this.airlineService.getRefundableEther(this.state.account)).toNumber();
        this.setState({
            refundableEther: this.toEther(refundableEther)
        });
    }

    async refundLoyaltiPoints() {
        await this.airlineService.redeemLoyaltiPoints(this.state.account);
    }

    async load() {
        this.getBalance();
        this.getFlights();
        this.getCustomerFlights();
        this.getRefundableEther();
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">
                        <p><strong>{this.state.account}</strong></p>
                        <span><strong>Balance:</strong> {this.state.balance}</span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">
                        <span>{this.state.refundableEther} eth</span>
                        <button className='btn btn-success' onClick={() => this.refundLoyaltiPoints()}>Redeem</button>
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                        {this.state.flights.map((flight,i) => {
                            return <div key={i}>
                                <span>{flight.name} - {this.toEther(flight.cost)}</span>
                                <button className='btn btn-success' onClick={() => this.buyFlight(i,flight)}>Purchase</button>
                            </div>
                        })}
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">
                        {this.state.customerFlights.map((flight,i) => {
                            return <div key={i}>
                                <span>{flight.name} - cost: {this.toEther(flight.cost)} eth</span>
                            </div>
                        })}
                    </Panel>
                </div>
                <ToastContainer />
            </div>
        </React.Fragment>
    }
}