import React from "react";
import web3 from "./web3";
import lottery from "./lottery";
import './App.css';

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };
  async componentDidMount() {
    //Get the lottery contract manager
    const manager = await lottery.methods.manager().call();
    this.setState({ manager });
    this.updateInfo();
  }

  async updateInfo() {
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Entering the lottery..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
    this.updateInfo();
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Picking a winner..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: "A winner has been picked!" });
    this.updateInfo();
  };

  render() {
    return (
      <div>
        <div class="container">
          <h1>The Great Lottery!</h1>
          <p class="prize">{this.state.balance ? "Prize " + web3.utils.fromWei(this.state.balance, "ether") + " ETH" : "Loading..."}</p>
          <form onSubmit={this.onSubmit}>
            <div class="form-row align-items-center">
              <div class="col-auto">
                <label for="amount">Enter the lottery</label>
              </div>
              <div class="col-auto">
                <input onChange={(event) => this.setState({ value: event.target.value })} type="text" class="form-control is-invalid" id="amount" placeholder="Value to enter with"/>
              </div>
              <div class="col-auto">
                <button type="submit" class="btn btn-danger">Enter</button>
              </div>
            </div>
          </form>

          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Account</th>
              </tr>
            </thead>
            <tbody>
              {this.state.players.map(( address, index ) => {
              return (
                <tr>
                  <th scope="row">{index+1}</th>
                  <td>{address}</td>
                </tr>
                );
            })}
            </tbody>
          </table>
          <button type="button" onClick={this.onClick} class="btn btn-danger btn-lg">Pick a Winner!</button>
          <h1>{this.state.message}</h1>
        </div>
      </div>
    );
  }
}
export default App;
