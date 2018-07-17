pragma solidity ^0.4.18;
// We have to specify what version of compiler this code will compile with

contract Vibes {
 
  
  mapping (uint32 => string) public databc;  
  mapping (uint32 => mapping (uint32 => bytes32)) public verdicts;
  mapping (uint32 => mapping (uint32 => bytes32)) public oemverdicts;
  mapping (uint32 => uint32) public mapVerdictDesign;
  mapping (bytes32 => uint32) public designName;
  mapping (uint32 => bytes32) public designName2;
  mapping (uint32 => bytes32) public OEMname;
  mapping (uint32 => bytes32) public T1name;

  uint32 public datanumber;
  uint32 public verdictnumber;
  uint32 public oemverdictnumber;

  

  
  function Vibes() public {
  datanumber = 0;
  verdictnumber = 0;
  oemverdictnumber = 0;
   
  }

// function to get current blocknumber to read data
  function currNumber() constant returns (uint32) {
    return datanumber;
  }

// function to get data given the blocknumber
  function getData( uint32 blocknum) view public returns (string) {
    return databc[blocknum];
  }
// function to get data by name
  function getDataByName(bytes32 name) view public returns (string) {
    return databc[designName[name]];
  }


// function to add T1 verdict
  function addVerdict(uint32 num, bytes32 verdict, bytes32 t1n) public {
    verdicts[num][mapVerdictDesign[num]] = verdict;
    mapVerdictDesign[num] += 1;
    bytes32 name = designName2[num];
    T1name[num] = t1n;
    newVerdict (t1n, name, num, verdict);
  }

  // function to add T1 verdict by name
  function addVerdictByName(bytes32 name, bytes32 verdict, bytes32 t1n) public {
    uint32 num = designName[name];
    verdicts[num][mapVerdictDesign[num]] = verdict;
    mapVerdictDesign[num] += 1;
    T1name[num] = t1n;
    newVerdict (t1n,name, mapVerdictDesign[num]-1, verdict);
  }

//function to add OEM code verdicts
  function addOEMVerdict(uint32 num, bytes32 verdict) public {
    oemverdicts[num][oemverdictnumber] = verdict;
    oemverdictnumber += 1;
    bytes32 name = designName2[num];
    newOEMVerdict ( name, num, verdict);
  }

//function to add OEM code verdicts by name
  function addOEMVerdictByName(bytes32 name, bytes32 verdict) public {
    uint32 num = designName[name];
    oemverdicts[num][oemverdictnumber] = verdict;
    oemverdictnumber += 1;
    newOEMVerdict (name, num, verdict);
  }

//function to get verdict
  function getVerdict(uint32 num, uint32 verdictnum) view public returns (bytes32) {
    return verdicts[num][verdictnum];
  }


//function to get verdict
  function getVerdictByName(bytes32 name, uint32 verdictnum) view public returns (bytes32) {
    uint32 num = designName[name];
    return verdicts[num][verdictnum];
  }

// function to get OEM verdicts
  function getOEMVerdict(uint32 num, uint32 oemverdictnum) view public returns (bytes32) {
    return oemverdicts[num][oemverdictnum];
  }


// function to get current verdict number to loop through
 function verdictNumber() view public returns (uint32) {
    return verdictnumber;
  }

// function to get current oem verdict number for looping
 function oemNumber() view public returns (uint32) {
    return oemverdictnumber;
  }

// function to add data
  function addData(string data, bytes32 name, bytes32 Cname) public {
    databc[datanumber] = data;
    designName[name] = datanumber;
    designName2[datanumber] = name;
    OEMname[datanumber] = Cname;
    datanumber += 1;
    // deploy event
    newDesign (datanumber-1, name, Cname);
  }
  
  //return OEM name
  function getOEMNameByDname(bytes32 datanum) view public returns(bytes32){
    return OEMname[designName[datanum]];
  }

// event to be called with blocknumber
event newDesign (uint32 datanumber, bytes32 name, bytes32 cname);
event newVerdict (bytes32 t1name, bytes32 name, uint32 verdictnumber, bytes32 verdict);
event newOEMVerdict ( bytes32 name, uint32 verdictnumber, bytes32 verdict);
 
}
