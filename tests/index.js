import { assert, AssertionError } from "chai";
import { Logger } from "logover";
import fs from "fs";
import path from "path";

let rpc;
let web3;
let tests;
let _t;
let test;
let response;
let smartContract;
let prom;
let res;
const logover = new Logger({ level: "debug" });
// --before-all--
// Stop and start node in background
const { spawn } = await import("child_process");
const _node = spawn("node", ["node/provider.js"], {
  cwd: "..",
  stdio: "ignore",
});

await new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 2000);
});

const web3Path = "../web3/index.js";
async function importSansCache(p) {
  const cacheBustingModulePath = `${p}?update=${Date.now()}`;
  return (await import(cacheBustingModulePath)).default;
}

const Web3 = await importSansCache(web3Path);

delete global.Web3;
global.Web3 = Web3;
global._node = _node;

// 1
assert.exists(Web3);
console.log("TESTE 1");

// 2
web3 = new Web3("http://localhost:3001");
assert.instanceOf(web3.provider, URL);
assert.equal(web3.provider.href, "http://localhost:3001/");

console.log("TESTE 2");

// 3
assert.isFunction(web3.setClientAddress);
web3.setClientAddress("Tom_the_tomnificent");
assert.equal(web3.address, "Tom_the_tomnificent");

console.log("TESTE 3");

// 4
assert.isFunction(web3.call);

console.log("TESTE 4");

// 5
rpc = {
  method: "get_contract_account",
  args: [],
  id: 0,
};
web3.setClientAddress("fcc_test_5");
try {
  await web3.call(rpc);
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
assert(
  tests.some((t) => t.url === "/call-smart-contract"),
  "`new Web3(provider).call()` should make a `POST /call-smart-contract` request to `this.provider`"
);

console.log("TESTE 5");

// 6
rpc = {
  method: "test_6",
  args: [],
  id: 0,
};
web3.setClientAddress("fcc_test_6");
try {
  await web3.call(rpc);
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
test = tests.find((t) => t.body?.method === "test_6");
assert.deepInclude(test?.body, { ...rpc });

console.log("TESTE 6");

// 7
rpc = {
  method: "test_7",
  args: [],
  id: 0,
};
web3 = new Web3("http://localhost:3001");
try {
  await web3.call(rpc);
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
test = tests.find((t) => t.body?.method === "test_7");
assert.deepInclude(test.headers, { "content-type": "application/json" });

console.log("TESTE 7");

// 8
rpc = {
  method: "test_8",
  args: [],
  id: 0,
};
web3 = new Web3("http://localhost:3001");
web3.setClientAddress("fcc_test_8");
assert.equal(
  web3.address,
  "fcc_test_8",
  "`setClientAddress` should set `this.address`"
);
try {
  await web3.call(rpc);
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
test = tests.find((t) => t.body?.address === "fcc_test_8");
assert.exists(test);
assert.deepInclude(test?.body, { address: "fcc_test_8" });

console.log("TESTE 8");

// 9
rpc = {
  method: "get_contract_account",
  args: [],
  id: 0,
};

web3 = new Web3("http://localhost:3001");
web3.setClientAddress("fcc_test_9");

try {
  response = await web3.call(rpc);
} catch (e) {}
assert.deepEqual(response, { total_clicks: 0, clickers: [] });

console.log("TESTE 9");

// 10
web3 = new Web3("http://localhost:3001");

try {
  await web3.call({ test: "todo" });
  assert.fail("'call' should have thrown");
} catch (e) {
  if (e instanceof AssertionError) {
    throw e;
  }
  assert.equal(e.message, "Smart contract with id 'undefined' not found");
}

console.log("TESTE 10");

// 11
web3 = new Web3("http://localhost:3001");
assert.isFunction(web3.initSmartContract);

console.log("TESTE 11");

// 12
web3 = new Web3("http://localhost:3001");
smartContract = web3.initSmartContract(
  (await import("../node/idl.json", { assert: { type: "json" } })).default
);
assert.isObject(smartContract);
assert.exists(smartContract.set_click);

console.log("TESTE 12");

// 13
web3 = new Web3("http://localhost:3001");
smartContract = web3.initSmartContract(
  (await import("../node/idl.json", { assert: { type: "json" } })).default
);
console.log(smartContract);
assert.isObject(smartContract);
assert.exists(smartContract.get_contract_account);

console.log("TESTE 13");

// 14
web3 = new Web3("http://localhost:3001");
smartContract = web3.initSmartContract(
  (await import("../node/idl.json", { assert: { type: "json" } })).default
);
assert.isFunction(smartContract.set_click);

console.log("TESTE 14");

// 15
web3 = new Web3("http://localhost:3001");
smartContract = web3.initSmartContract(
  (await import("../node/idl.json", { assert: { type: "json" } })).default
);
assert.isFunction(smartContract.get_contract_account);

console.log("TESTE 15");

// 16
web3 = new Web3("http://localhost:3001");
smartContract = web3.initSmartContract(
  (await import("../node/idl.json", { assert: { type: "json" } })).default
);
try {
  await smartContract.set_click();
  await smartContract.set_click(1);
  await smartContract.set_click(true);
  await smartContract.set_click([]);
  await smartContract.set_click({});
  await smartContract.set_click(() => {});
  await smartContract.set_click(null);
  await smartContract.set_click(undefined);
  await smartContract.set_click(new Date());
  await smartContract.set_click(new RegExp());
  assert.fail("`smartContract.set_click()` should have thrown");
} catch (e) {
  if (e instanceof AssertionError) {
    assert.includes(e.message, "Unexpected argument");
    throw e;
  }
}

console.log("TESTE 16");

// 17
web3 = new Web3("http://localhost:3001");
smartContract = web3.initSmartContract(
  (await import("../node/idl.json", { assert: { type: "json" } })).default
);
prom = smartContract.set_click("test");
assert.instanceOf(prom, Promise);
res = await prom;
assert.deepEqual(res, {
  base_account: { total_clicks: 1, clickers: ["test"] },
});

console.log("TESTE 17");

// 18
web3 = new Web3("http://localhost:3001");
smartContract = web3.initSmartContract(
  (await import("../node/idl.json", { assert: { type: "json" } })).default
);
prom = smartContract.get_contract_account();
assert.instanceOf(prom, Promise);
res = await prom;
assert.deepEqual(res, { total_clicks: 1, clickers: ["test"] });

console.log("TESTE 18");

// 19
web3 = new Web3("http://localhost:3001");
assert.isFunction(web3.getBalance);

console.log("TESTE 19");

// 20
web3 = new Web3("http://localhost:3001");
try {
  await web3.getBalance("shaun");
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
assert.isTrue(tests.some((t) => t.url === "/get-balance"));

console.log("TESTE 20");

// 21
web3 = new Web3("http://localhost:3001");
web3.setClientAddress("Tom_the_tomnificent");
try {
  await web3.getBalance("fcc_test_14");
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
test = tests.find((t) => t.body?.address === "fcc_test_14");
assert.deepInclude(test?.body, { address: "fcc_test_14" });

console.log("TESTE 21");

// 22
web3 = new Web3("http://localhost:3001");
web3.setClientAddress("fcc_test_15");
try {
  await web3.getBalance();
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
test = tests.find((t) => t.body?.address === "fcc_test_15");
assert.deepInclude(test?.body, { address: "fcc_test_15" });

console.log("TESTE 22");

// 23
web3 = new Web3("http://localhost:3001");
try {
  await web3.getBalance("fcc_test_16");
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
test = tests.find((t) => t.body?.address === "fcc_test_16");
assert.deepInclude(test?.headers, { "content-type": "application/json" });

console.log("TESTE 23");

// 24
web3 = new Web3("http://localhost:3001");

try {
  response = await web3.getBalance("shaun");
} catch (e) {}

console.log("TESTE 24");

// 25
web3 = new Web3("http://localhost:3001");
try {
  await web3.getBalance();
  assert.fail("'getBalance' should have thrown");
} catch (e) {
  if (e instanceof AssertionError) {
    assert.equal(e.message, "Missing required fields: address: null");
    throw e;
  }
}

console.log("TESTE 25");

// 26
web3 = new Web3("http://localhost:3001");
assert.isFunction(web3.transfer);

console.log("TESTE 26");

// 27
_t = {
  from: "shaun",
  to: "tom",
  amount: 1,
};
web3 = new Web3("http://localhost:3001");
try {
  await web3.transfer(_t);
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
assert.isTrue(tests.some((t) => t.url === "/transfer"));

console.log("TESTE 27");

// 28
_t = {
  from: "shaun",
  to: "tom",
  amount: 1,
};
web3 = new Web3("http://localhost:3001");
try {
  await web3.transfer(_t);
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
test = tests.find((t) => t.url === "/transfer");
assert.deepInclude(test?.headers, { "content-type": "application/json" });

console.log("TESTE 28");
// 29
_t = {
  from: "from_address",
  to: "to_address",
  amount: 1,
};
web3 = new Web3("http://localhost:3001");
web3.setClientAddress("fcc_test_23_address");
try {
  await web3.transfer(_t);
} catch (e) {}
tests = await (await fetch("http://localhost:3001/tests")).json();
test = tests.find((t) => t.body?.from === "from_address");
assert.deepEqual(test?.body, _t);

console.log("TESTE 29");

// 30
_t = {
  from: "shaun",
  to: "tom",
  amount: 100,
};
web3 = new Web3("http://localhost:3001");
try {
  response = await web3.transfer(_t);
} catch (e) {}
assert.equal(response, "success");

console.log("TESTE 30");

// 31
web3 = new Web3("http://localhost:3001");
try {
  await web3.transfer({ amount: 10 });
  assert.fail("'transfer' should have thrown");
} catch (e) {
  if (e instanceof AssertionError) {
    throw e;
  }
  assert.equal(
    e.message,
    "Missing required fields: from: null, to: undefined, amount: 10"
  );
}

console.log("TESTE 31");

// Kill node process
const _end = _node.kill();
logover.debug("killing node process...", _end);

const jsonData = [
  {
    hash: 0,
    previousHash: null,
    smartContracts: [],
  },
  {
    hash: "00161fee4858f91023cfcd249ec4cbe551186fadd8d9fa1c9770980cb792921a",
    previousHash: 0,
    nonce: 138,
    smartContracts: [
      {
        pathToPkg: "../node/pkg/build_a_smart_contract_in_rust.js",
        state: {
          base_account: {
            total_clicks: 0,
            clickers: [],
          },
        },
        id: 0,
      },
    ],
  },
];
