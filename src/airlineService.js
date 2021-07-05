export class AirlineService {
    constructor(contract) {
        this.contract = contract;
    }

    async getFlights() {
        let totalFlights = await this.getTotalFlights();
        let flights = [];
        for(var i=0;i<totalFlights;i++) {
            let flight = await this.contract.flights(i);
            flights.push(flight);
        }        
        return this.mapFlights(flights);
    }

    async getTotalFlights() {
        return (await this.contract.totalFlights()).toNumber();
    }

    async getCustomerFlights(account) {
        const totalCustomerFlights = await this.contract.customerTotalFlights(account);
        const flights = [];
        for(var i=0;i<totalCustomerFlights;i++) {
            const flight = await this.contract.customerFlights(account,i);
            flights.push(flight);
        }
        return this.mapFlights(flights);
    }

    async getRefundableEther(from) {
        return this.contract.getRefundableEther({ from });
    }

    async redeemLoyaltiPoints(from) {        
        return this.contract.redeemLoyaltyPoints({ from });
    }

    async buyFlight(flightIndex,from,value) {
        await this.contract.buyFlight(flightIndex, { from, value });
    }

    mapFlights(flights) {
        return flights.map(flight => {
            return {
                name: flight[0],
                cost: flight[1].toNumber()
            };
        });
    }
}