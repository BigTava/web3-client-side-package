export default class Web3 {
  constructor(provider) {
    this.address = null;
    this.provider = new URL(provider);
  }
  setClientAddress(address) {
    this.address = address;
  }
  async call(rpcCall) {
    const body = {
      ...rpcCall,
      address: this.address,
    };
    const res = await fetch(`${this.provider.href}call-smart-contract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const response = await res.json();
    if (response.error) {
      throw new Error(response.error);
    }
    return response.result;
  }

  initSmartContract(idl) {
    const smartContract = {};
    for (const instruction of idl.instructions) {
      smartContract[instruction.handle] = async (...args) => {
        const rpcCall = {
          id: idl.id,
          method: instruction.handle,
          args,
        };
        return await this.call(rpcCall);
      };
      return smartContract;
    }
  }
  async getBalance(address) {}
  async transfer({ from, to, amount }) {}
}

const web3 = new Web3("http://localhost:3001");
console.log(web3);

web3.setClientAddress("Tom");
console.log(web3.address);

const res = await web3.call({
  id: 0,
  args: [],
  method: "test",
  address: web3.address,
});

console.log(res);