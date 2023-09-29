import {Buttons, TextBox, DisplayText, VariableMenu, ProcessMenu, RadioSelect} from './ComponentList.js'
import {ObjectMenu, Table, TableCutID, DeviceMethodContainer} from './ComponentsList2'
import { create } from 'zustand';
import { Component, useCallback, useEffect, useMemo, useState} from 'react';
import ReactFlow, {Handle, useNodesState, useEdgesState, addEdge, applyEdgeChanges, applyNodeChanges} from 'react-flow-renderer';
import { Background, BackgroundVariant, ReactFlowProvider } from 'reactflow';
import {useTable} from "react-table"
import {ProcessNode, RevisedNode, DeviceNode, MethodNodeVal, DevMethodVisualize} from "./playground.js"


import 'reactflow/dist/style.css';
import ButtonEdge from './ButtonEdge.js';
import { render } from '@testing-library/react';
import axios from 'axios';
import { redirect } from 'react-router';

const nodeTypes = {ProcNode  : ProcessNode, RevNode : RevisedNode, MethNode : MethodNodeVal, DevNode : DeviceNode}

export const GraphBuilderFunc = ({SimID}) =>{


    const nodeList = [
    ]
    
    const edgeList =  [
    ] 



    const [varList, setVarList] = useState([])
    const [objName, setObjName] = useState("")
    const [ProcessList, setProcessList] = useState([])
    const [errorState, setErrorState] = useState("Fine")
    const [dispMode, setDispMode] = useState("Add Variable")
    const [nodes, setNodes, onNodesChange] = useNodesState(nodeList);
    const [edges, setEdges, onEdgesChange] = useEdgesState(edgeList);
    
    const [ObjQual, setObjQual] = useState({ registerList : [], 
      regFuncList : [], 
      outPutList : [], 
      inputList : [], 
      commandMaps : []})
    
      const [nodeSelectID, setNodeSelectID] = useState(-1)
    const [nodeSelectName, setNodeSelectName] = useState("")
    

    function onNodeClicked(e, node){
       console.log(node.id)
       setNodeSelectName(node.id)
       setNodeSelectID(node.UID)
       console.log(nodeSelectID)

      /*
       for (let i = 0; i < nodes.length; i++){
            if(nodes[i].id == node.id){
                const targetObject = ProcessList[i]; 
                setNodeSelectID(targetObject["ProcessID"])
                setNodeSelectName(targetObject["ProcessName"])
            }
       } 
       */ 

       GetObjData(node.UID)
    }

    useEffect( () => {
      // GET VISUAL DATA FROM THE DATABASE 

      InitGetVisuals(); 
      // GET THE Inital Data Visuals 
    }, [])


    async function GetObjData(objID){
      const uriStr = "http://127.0.0.1:5000/api/GetObject/SimID=1/ObjectID=" + objID 
      await axios.get(uriStr, { 

      })
      .then(
        response => {
          console.log("Hello FROM HERE")
          console.log(response)
          setObjQual(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }

    

    function onEdgeClicked(e, edge){
        console.log(edge.id)
    }

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    function menuSwitch(e){
      setDispMode(e)
    }

    function IOChartEdit(ioData){
      let currentNodeNm = nodeSelectName 

      const new_input_list = ioData["new_inputs"]
      const new_output_list = ioData["new_outputs"]

      const n_o_l = []
      const n_i_l = []

      let nodesCopy = [...nodes]

      console.log("NODES COPY", nodesCopy)
      console.log("CURRENT NODDEs", currentNodeNm)

      for(let input in new_input_list){
        n_i_l.push(String(new_input_list[input]))
      }

      for(let output in new_output_list){
        n_o_l.push(String(new_output_list[output]))
      }

      console.log(n_i_l)
      console.log(n_o_l)

      for(let i = 0 ; i < nodesCopy.length; i++){
        if(nodesCopy[i].id == currentNodeNm){
          console.log("Change OUT", new_output_list)
          nodesCopy[i].data["inputs"] = [...n_i_l]
          nodesCopy[i].data["outputs"] = [...n_o_l]
        }
      }

      console.log("made it")
      console.log("WATCHUSAYING: ", nodesCopy)
      setNodes(nodesCopy)
    }

    async function saveVisuals(elementToSend){
      console.log("ADDVISUALDB WORKDING")
      await axios.post("http://127.0.0.1:5000/api/SaveVisuals", elementToSend, { 

      })
      .then(
        response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }

    function addProc(inVarState){
      console.log(inVarState)
      //add to Process List: 
      setProcessList([...ProcessList, (inVarState)])

      //Create the node
      let name = inVarState.ProcessName; 
      let outPutVars = inVarState.OutPutVars; 
      let inVarMap = Object.values(inVarState.inVarMap); 
      let objectID = inVarState.ProcessID; 

      console.log(name)
      console.log(outPutVars)
      console.log(inVarMap)

      let newNode = {id : name, data : {label : name, 
        outputs : outPutVars, inputs : inVarMap}, 
        type : 'RevNode', position : {x : 100, y : 100}, UID : objectID}
      
      
      setNodes([...nodes, newNode])

    }

    async function AddObjectDB(elementToSend){
      console.log("ADDOBJEBWORKING")
      await axios.post("http://127.0.0.1:5000/api/AddObject", elementToSend, { 
        
      
      })
      .then(
        response => {
          console.log(response)
          if(response.data["issue"] == false){
            elementToSend.ProcessID = response.data["NewId"]
            addProc(elementToSend)
          }
        })
        .catch(error => {
          console.log(error)
        })
    }

    function handleObjectAdd(e) {
      e.preventDefault()
      const newInVarSt = {
        ProcessName : objName, 
        ProcessID : 1, 
        SimulationID  : SimID, 
        OutPutVars : [],
        inVarMap : []
      }

      AddObjectDB(newInVarSt)
    }


    async function InitGetVisuals(){

      let InitNodeData = [] 
      let InitEdgeData = [] 
      let call1 = true
      let call2 = true 

      // Get the typical node data: 
      await axios.get("http://127.0.0.1:5000/api/GetSimVisuals/SimID=1").then(
        response => {
          console.log(response); 
          call1 = true 
          InitNodeData = [...response.data] 
        })
        .catch(error=>{console.log(error)
        })

        const DevUriStr = "http://127.0.0.1:5000/api/GetMDGMethodInfo/SimID=1"
        await axios.get(DevUriStr, { 
        })
        .then(
          response => {
            call2 = true 
            const VisObj = DevMethodVisualize(response["data"])
            const nodeList = VisObj["NodeList"]
            const edgeList = VisObj["EdgeList"] 
            InitNodeData = [...InitNodeData, ...nodeList]
            InitEdgeData = [...InitEdgeData, ...edgeList]
          })
          .catch(error => {
            return error
          })

          if(call1 && call2){
            setNodes(InitNodeData)
            setEdges(InitEdgeData)

          }

      }
    

  

    return(
      <div className = "Menu">
  
          <div style={{ width: '100vw', height: '60vh' }}>

          <ReactFlowProvider>
            <ReactFlow 
              nodes = {nodes}
              edges = {edges}
              onNodesChange = {onNodesChange}
              onEdgesChange = {onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClicked}
              onEdgeClick={onEdgeClicked}
              nodeTypes = {nodeTypes}
            >
             <Background color = "gray" variant={BackgroundVariant.Dots}/>
            </ReactFlow>
          </ReactFlowProvider>
      
           </div>
          {errorState != "Fine" ? <p>{errorState}</p> : null}
          <div ClassName = "Addition">

          <div style={{display : "inline-block"}}>
          <form onSubmit = {(e) => handleObjectAdd(e)}>
            <input style = {{marginRight : '10px'}} type = "text" placeholder = "Add Object" onChange = {(e) => setObjName(e.target.value)}
            value = {objName}/>
            
            <input type="submit"/>
          </form>
          <button style={{backgroundColor : "red"}} onClick = {() => saveVisuals(nodes)}>Save Visuals</button>
          </div>

          <ObjectMenu 
          ObjectName = {nodeSelectName} ObjectID = {nodeSelectID} SimulationID = {1} VisualNodesEdit = {(val) => IOChartEdit(val)}
          ObjQual = {ObjQual}/>

          
        </div>   
      </div>
    )
  }


class DeviceInfoForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      PortNum : "", 
      PortType : "LED",
      PortPsudeonym : "", 

      // Device type array
      DevTypeList : [] 
    }
  }

  TransferData(e){
    e.preventDefault() 
    const StateCopy = JSON.parse(JSON.stringify(this.state))
    const sampleArry = [StateCopy.PortNum, StateCopy.PortType, StateCopy.PortPsudeonym]
    this.props.AddRow(sampleArry)
  }

  async GetDeviceData(){
    await axios.get("http://127.0.0.1:5000/api/GetDeviceTypes").then(
      response=>{
        this.setState({DevTypeList : response.data}, 
          console.log("Device Type: ", this.state.DevTypeList))
        
      }
    ).catch(error =>{
      console.log(error)
    })
  }

  
  componentWillMount(){
    this.GetDeviceData() 
  }

  
  

  

  render(){
    return(
      <div className = "DevPortInput" style = {{ marginLeft : "20px"}}> 

      <h2 style = {{fontFamily: "monospace"}}>Add New Device: </h2> 

      <form onSubmit = {(e) => this.TransferData(e)}>
        <label for = "PortEntry">Port Num: </label>
        <input type="text" placeholder = "Port #" onChange = {(e) => this.setState({PortNum : e.target.value})}
        value = {this.state.PortNum}/>

        <label for="DeviceType">Choose a Device Port Type:</label> 
            <select name="DeviceName" id="DeviceName" onChange={(e)=>this.setState({PortType : e.target.value})}> 
                {this.state.DevTypeList.map((val, index)=>(<option key={index}value={val}>{val}</option>))}
            </select>

        <label for="DevName">Set the Device Name</label>
          <input id = "DevName" type="text" placeholder = "Psuedonym" onChange={(e)=>this.setState({PortPsudeonym : e.target.value})} 
          value = {this.state.PortPsudeonym}/>
        <br></br>
        <input type="submit"/>

        </form>
      
      
      
      </div>
    )
  }
}

class MethodForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      MethodName : "", 
      MethodList : []
        }

  }

  handleRowEdit(row_id){
    this.props.MethodMenuRowEdit(row_id)
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.AddInfo(this.state.MethodName)
  }



  render(){
    return(
      <div> 
        <form onSubmit = {(e) => this.handleSubmit(e)}>
          <label style = {{fontFamily : "monospace", fontSize : 16, color:"#0afd02"  }} or="RowEdit">Method name</label>
          <input id = "RowEdit" type ="text" placeholder = "Method Name" onChange = {(e)=>this.setState({MethodName : e.target.value})} value = {this.state.MethodName}/>
          <input type="Submit" value = "Add Method"/>


        </form>

        <TableCutID  varLabels = {["Method", 'Edit']} entries = {this.props.MethodList} Editable = {true}  
        getRowID = {(row_id) => this.handleRowEdit(row_id)}/>

      </div>

    )
  }
}


// DEVICE MANAGER OBJECT FORMAT: 




export class DeviceManager extends Component{
    constructor(props){
        super(props)
        this.state = {
            CodeEntryForm : "", 
            DevicePassword : "", 
          
            // Device Information Organization
            DeviceList : [], 
            ChosenDevice : "Default", 
            ChosenMethod : "NULL", 


            DeviceMenuConstruct : {"Default" : {
              PORT_INFO : [], 
              METHODS : {"Method1" : {}}
            }}, 
            SubDeviceTable : [], 
            ComponentTable : [], 
        }
    }

    
    // Local Method read data: 
    ReadMethodName(){
      let MethodName = []
      const KeyList = Object.keys(this.state.DeviceMenuConstruct[this.state.ChosenDevice]["METHODS"])
      for(let i = 0; i < KeyList.length; i++){
        MethodName.push([KeyList[i]])
      }
      return MethodName
    }

    // Make Device Handler Call: 
    async DevConnectionHandler(ValidPkg){
      await axios.post("http://192.168.4.95:5001/ValidSearch", ValidPkg).then(
        response=>{
          console.log(response.data)
          if(response.data["PassStatus"] == "Match")
            this.AddDeviceUI(ValidPkg["DEVICE_ID"])
        }
        ).catch( error =>{
          console.log(error)
        })  
    }



    HandleSubmit(e){
      e.preventDefault() 

      let ValidState = {
        "DEVICE_ID" : this.state.CodeEntryForm, 
        "DEVICE_PASSWORD" : this.state.DevicePassword,
        "SIM_ID" : 1
      }


      // Make the call to the Device Storage DB: 
      let connected = false
      for(let i = 0; i < this.state.DeviceList.length; i++){
        if(this.state.DeviceList[i][0] == ValidState["DEVICE_ID"]){
          connected = true 
        }      
      }

      if(connected == true){
        console.log("Device Already Connected")
      }
      else{
        console.log("Testing Connection") 
        this.DevConnectionHandler(ValidState)
      }


  }

    AddDeviceUI(Device_ID){
            // ADD THE PROTCOL CODE HERE: 

            let newEntry = [Device_ID, "NAME"]
            let DeviceCopy = JSON.parse(JSON.stringify(this.state.DeviceMenuConstruct))
            DeviceCopy[Device_ID] = {"PORT_INFO" : [], 
            "METHODS" : {}} 
        
            let DLCopy = [...this.state.DeviceList] 
            DLCopy.push(newEntry)
      
            this.setState({DeviceMenuConstruct : DeviceCopy, 
            DeviceList : DLCopy})

    }

    AddInfo(name){
      let ConstObj = JSON.parse(JSON.stringify(this.state.DeviceMenuConstruct)) 
      ConstObj[this.state.ChosenDevice]["METHODS"][name] = {"COMMANDS": [], "VARIABLES": {}, "HEADER_LIST": []}
      this.setState({DeviceMenuConstruct : ConstObj}, () => console.log(this.state.DeviceMenuConstruct))
    }
    

    AddPort(newRow){

      // Add the record to the Port task 
      let copy = JSON.parse(JSON.stringify(this.state.DeviceMenuConstruct))
      let prevList = copy[this.state.ChosenDevice]["PORT_INFO"]
      let omar  = [...prevList, newRow] 
      copy[this.state.ChosenDevice]["PORT_INFO"] = omar
      this.setState({DeviceMenuConstruct : copy}, 
        () => console.log(this.state.DeviceMenuConstruct))
    }

    handleRowEdit(rowID){
      const nameSelect = this.state.DeviceList[rowID]
      this.setState({ChosenDevice : nameSelect[1]})  
      // Reset the chosen method
      this.setState({ChosenMethod : "NULL"})
    }

    HandleMMRowEdit(e){
      this.setState({ChosenMethod : this.ReadMethodName()[e][0]})
      console.log(this.state.DeviceMenuConstruct)
    }

    MethodInfoSend(e){
      // Make a deep copy of the Device Menu Construct File 
      let DevConCopy = JSON.parse(JSON.stringify(this.state.DeviceMenuConstruct))
      DevConCopy[this.state.ChosenDevice]["METHODS"][this.state.ChosenMethod] = e 
      this.setState({DeviceMenuConstruct : DevConCopy}, 
        () => console.log(this.state.DeviceMenuConstruct))

    }

    
    render(){
        return(
            <div>
              <h2 style = {{fontFamily: "monospace", textAlign : "center"}}>Enter Device Information: </h2> 
          
                <form style = {{margin: '0 auto', display :  "flex", justifyContent : "center",  flexDirection: "row", alignItems:"center", width:"100%"}} onSubmit = {(e) => this.HandleSubmit(e)}>
                   
              
                    <div style = {{margin: "auto", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}  >
                    <input style = {{marginRight : '10px'}} type="text" placeholder = "Enter Device Code" onChange = {(e) => (this.setState({CodeEntryForm : e.target.value}))}
                    value = {this.state.CodeEntryForm}/>

                    <br></br>
                    <input style = {{marginRight : '10px'}} type="text" placeholder = "Enter Device Password" onChange = {(e) => (this.setState({DevicePassword: e.target.value}))}
                    value = {this.state.DevicePassword}/>
                    <input type="submit"/> 
                    </div>

                </form> 

                <TableCutID varLabels = {["ID", "Device", "Edit"]} entries = {this.state.DeviceList}
                Editable = {true} getRowID = {(val) => this.handleRowEdit(val)}/>
                <br></br>
                <br></br>
                <h2 style = {{fontFamily: "monospace", textAlign : "center"}}>Current Device: {this.state.ChosenDevice} </h2> 
                <br></br>
                <div style = {{position : "center"}}>
                <h2 style = {{fontFamily: "monospace", textAlign : "center"}}>Current Method: {this.state.ChosenMethod} </h2> 
                <MethodForm MethodList = {this.ReadMethodName()} AddInfo = {(e) => this.AddInfo(e)} MethodMenuRowEdit = {(e) => this.HandleMMRowEdit(e)}/>
                </div>
                <div style ={{display : "flex", marginLeft: "30px"}}>
                  <DeviceInfoForm AddRow = {(e) => this.AddPort(e)} />
                  <TableCutID varLabels = {["Port", "Port Type", "Pseudonym", "Edit"]} entries = {this.state.DeviceMenuConstruct[this.state.ChosenDevice]["PORT_INFO"]}
                    Editable = {true} getRowID = {(val) => this.handleRowEdit(val)} />
                  <div style = {{marginLeft : "90px"}}>

                  


                  <DeviceMethodContainer MethodObjProp = {this.state.ChosenMethod == "NULL"  ? []  : this.state.DeviceMenuConstruct[this.state.ChosenDevice]["METHODS"][this.state.ChosenMethod]["COMMANDS"]} MasterHandler = {(e) => this.MethodInfoSend(e)}port_map = {this.state.DeviceMenuConstruct[this.state.ChosenDevice]["PORT_INFO"]}
                  VarDictProps = {this.state.ChosenMethod == "NULL"  ? {}  : this.state.DeviceMenuConstruct[this.state.ChosenDevice]["METHODS"][this.state.ChosenMethod]["VARIABLES"]}/>


                  </div> 
                </div>
              <div style ={{float : "top"}}>
              </div>
            </div>
        )
    }
}



















// DELTE THIS POC ITEM: 
export class DeviceManagerPOC extends Component{
  constructor(props){
      super(props)
      this.state = {
          CodeEntryForm : "", 
          DevicePassword : "", 
        
          // Device Information Organization
          
          ChosenDevice : "Default", 
          ChosenMethod : "NULL", 

          DeviceList : [], 
          DeviceMenuConstruct : {"Default" : {
            PORT_INFO : [], 
            METHODS : {"Method1" : {}}
          }}, 
       
      }
  }

  
  // Local Method read data: 
  ReadMethodName(){
    let MethodName = []
    const KeyList = Object.keys(this.state.DeviceMenuConstruct[this.state.ChosenDevice]["METHODS"])
    for(let i = 0; i < KeyList.length; i++){
      MethodName.push([KeyList[i]])
    }
    return MethodName
  }


  HandleSubmit(e){
    e.preventDefault() 

    // ADD THE PROTCOL CODE HERE: 
    let sampleID = parseInt(Math.random() * 10000000)
    let newEntry = [sampleID, this.state.CodeEntryForm]
    let DeviceCopy = JSON.parse(JSON.stringify(this.state.DeviceMenuConstruct))
    DeviceCopy[this.state.CodeEntryForm] = {"PORT_INFO" : [], 
    "METHODS" : {}} 


    let DLCopy = [...this.state.DeviceList] 
    DLCopy.push(newEntry)


    this.setState({DeviceMenuConstruct : DeviceCopy, 
    DeviceList : DLCopy})
    
    let sendData = {"Device_Code" : this.state.CodeEntryForm, "Device_Password" : this.state.DevicePassword}
  }

  AddInfo(name){
    let ConstObj = JSON.parse(JSON.stringify(this.state.DeviceMenuConstruct)) 
    ConstObj[this.state.ChosenDevice]["METHODS"][name] = {"COMMANDS": [], "VARIABLES": {}, "HEADER_LIST": []}
    this.setState({DeviceMenuConstruct : ConstObj}, () => console.log(this.state.DeviceMenuConstruct))
  }
  

  AddPort(newRow){

    // Add the record to the Port task 
    let copy = JSON.parse(JSON.stringify(this.state.DeviceMenuConstruct))
    let prevList = copy[this.state.ChosenDevice]["PORT_INFO"]
    let omar  = [...prevList, newRow] 
    copy[this.state.ChosenDevice]["PORT_INFO"] = omar
    this.setState({DeviceMenuConstruct : copy}, 
      () => console.log(this.state.DeviceMenuConstruct))
  }

  handleRowEdit(rowID){
    const nameSelect = this.state.DeviceList[rowID]
    this.setState({ChosenDevice : nameSelect[1]})  
    // Reset the chosen method
    this.setState({ChosenMethod : "NULL"})
  }

  HandleMMRowEdit(e){
    this.setState({ChosenMethod : this.ReadMethodName()[e][0]})
    console.log(this.state.DeviceMenuConstruct)
  }

  MethodInfoSend(e){
    // Make a deep copy of the Device Menu Construct File 
    let DevConCopy = JSON.parse(JSON.stringify(this.state.DeviceMenuConstruct))
    DevConCopy[this.state.ChosenDevice]["METHODS"][this.state.ChosenMethod] = e 
    this.setState({DeviceMenuConstruct : DevConCopy}, 
      () => console.log(this.state.DeviceMenuConstruct))

  }

  
  render(){
      return(
          <div>
            <h2 style = {{fontFamily: "monospace", textAlign : "center"}}>Enter Device Information: </h2> 
        
              <form style = {{margin: '0 auto', display :  "flex", justifyContent : "center",  flexDirection: "row", alignItems:"center", width:"100%"}} onSubmit = {(e) => this.HandleSubmit(e)}>
                 
            
                  <div style = {{margin: "auto", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}  >
                  <input style = {{marginRight : '10px'}} type="text" placeholder = "Enter Device Code" onChange = {(e) => (this.setState({CodeEntryForm : e.target.value}))}
                  value = {this.state.CodeEntryForm}/>

                  <br></br>
                  <input style = {{marginRight : '10px'}} type="text" placeholder = "Enter Device Password" onChange = {(e) => (this.setState({DevicePassword: e.target.value}))}
                  value = {this.state.DevicePassword}/>
                  <input type="submit"/> 
                  </div>
raspbe
              </form> 

              <TableCutID varLabels = {["ID", "Device", "Edit"]} entries = {this.state.DeviceList}
              Editable = {true} getRowID = {(val) => this.handleRowEdit(val)}/>
              <br></br>
              <br></br>
              <h2 style = {{fontFamily: "monospace", textAlign : "center"}}>Current Device: {this.state.ChosenDevice} </h2> 
              <br></br>
              <div style = {{position : "center"}}>
              <h2 style = {{fontFamily: "monospace", textAlign : "center"}}>Current Method: {this.state.ChosenMethod} </h2> 
              <MethodForm MethodList = {this.ReadMethodName()} AddInfo = {(e) => this.AddInfo(e)} MethodMenuRowEdit = {(e) => this.HandleMMRowEdit(e)}/>
              </div>
              <div style ={{display : "flex", marginLeft: "30px"}}>
                <DeviceInfoForm AddRow = {(e) => this.AddPort(e)} />
                <TableCutID varLabels = {["Port", "Port Type", "Pseudonym", "Edit"]} entries = {this.state.DeviceMenuConstruct[this.state.ChosenDevice]["PORT_INFO"]}
                  Editable = {true} getRowID = {(val) => this.handleRowEdit(val)} />
                <div style = {{marginLeft : "90px"}}>

                


                <DeviceMethodContainer MethodObjProp = {this.state.ChosenMethod == "NULL"  ? []  : this.state.DeviceMenuConstruct[this.state.ChosenDevice]["METHODS"][this.state.ChosenMethod]["COMMANDS"]} MasterHandler = {(e) => this.MethodInfoSend(e)}port_map = {this.state.DeviceMenuConstruct[this.state.ChosenDevice]["PORT_INFO"]}
                VarDictProps = {this.state.ChosenMethod == "NULL"  ? {}  : this.state.DeviceMenuConstruct[this.state.ChosenDevice]["METHODS"][this.state.ChosenMethod]["VARIABLES"]}/>


                </div> 
              </div>
            <div style ={{float : "top"}}>
            </div>
          </div>
      )
  }
}




