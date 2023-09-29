import { getDefaultNormalizer } from '@testing-library/react';
import React, { useEffect } from 'react';
import { Component, useCallback, useMemo, forwardRef, useState} from 'react';
import ReactFlow, { Background, Handle, Position} from 'react-flow-renderer';
import { useNodesState, useEdgesState, addEdge, MiniMap, Controls,  MarkerType, } from 'reactflow';
import axios from 'axios';


import 'reactflow/dist/style.css';

export default function CountFunc(){
    const [value, setValue] = useState(0)

    function handlePosClick(){
        setValue(prevValue => prevValue+1)
    }

    function handleNegClick(){
        if (value > -5){
        setValue(prevValue => prevValue - 1 )
        }

    }
    

    return(
        <div>
            <input type="button" value = "+" onClick = {(e)=>handlePosClick(e)}/>
            <h1>{value}</h1>
            <input type="button" value ="-" onClick = {(e)=>handleNegClick(e)}/>
        </div>
    )


}

export function TabSwitch(){
    const [ResourceState, setResState] = useState("Posts")
    const [inputNum, setInptNum] = useState(4)
    const [inputNum2, setInptNum2] = useState(0)


    function calcPrime(k){
        return k * 2 - 4 + (k*8)    
        
    }

    function handleComments(){
        setResState("Comments")

    }

    function handleUsers(){
        setResState("Users")

    }

    function handlePosts(){
        setResState("Posts")
    }

    function handleNumChange(e){
        setInptNum(e.target.value)
    }
    function handleNumChange2(e){
        setInptNum2(e.target.value)
    }
    const prim = useMemo(() => {return calcPrime(inputNum)}, [inputNum])


    useEffect(() => {
        console.log("Boy if you do't get ur picklechin ahh " + ResourceState)
    }, [ResourceState])

    return(
        <div>
            <input type="button" value = "Comments" onClick = {handleComments}/>
            <input type="button" value="Users" onClick = {handleUsers}/>
            <input type="button" value="Posts" onClick = {handlePosts}/>
            <input type="text" value = {inputNum} onChange = {(e) => handleNumChange(e)}/>
            <input type="text" value = {inputNum2} onChange = {(e) => handleNumChange2(e)}/>
            <h1>{prim}</h1>
        </div>
    )
}





const CustomNodeSample = ({ data }) => {
  const onChange = (evt) => {
    console.log(evt.target.value);
  };

  const handleStyle = {
    top: "90%",
  };
  
  const handleStyle1 = {
      top:"50%"
  }

  const labelStyle = {
    position: 'absolute',
    top: '50%',
    left: 'calc(100% - 60px)',
    fontSize: '12px',
    fontWeight: 'bold',
  };

  const O2 = {
    position: 'absolute',
    top: '50%',
    left: 'calc(100% - 60px)',
    top: '80%',
    fontSize: '12px',
    fontWeight: 'bold',
  };

  const I1 = {
    position: 'absolute',
    top: '50%',
    left: 'calc(0% + 10px)',
    transform: 'translateY(-50%)',
    fontSize: '12px',
    fontWeight: 'bold',
  };

  return (
    <div className="omar" style={{ position: 'relative', padding : "80px" }}>
      <Handle id="king" type="target" position={Position.Left} />
      <div style={I1}>Input1</div>
      <div className = "LabelInfo" style = {{display :"flex",position: "absolute",top: "0%",textAlign:"center"}}>
        <p>Process 1</p>
      </div>
      <Handle type="source" position={Position.Right} id="a" style = {handleStyle1} />
      <div style={labelStyle}>Output1</div>
      <Handle type="source" position={Position.Right} id="b" style={handleStyle} />
      <div style={O2}>Output2</div>
    </div>
  );
};

export function ProcessNode({data, vertSize}){
    const onChange = (evt) =>{
        console.log(evt.target.value)
    }

    let inputs = data.inputs; 
    let outputs = data.outputs; 
    let InDivFactor = 0.7/(data.inputs.length) * 100
    let OutDivFactor = 0.7/(data.outputs.length) * 100
    
    
    return(
        <>
        <div className = "King" style={{ position: 'relative', padding : "60px" }}>
        
        {inputs.map((inputName, index) => <div key = {index}><Handle
            
            id = {String(inputName)}
            type = "target"
            position = {Position.Left}
            style = {{top : InDivFactor * (index  + 1) + "%"}}
        />
        <div style={{position: 'absolute', left : 'calc(0% + 10px)', top: InDivFactor * (index + 1)  - 5 + "%"}}>{inputName}</div>
        </div> 
        )}
        <p>{data.label}</p>
        {outputs.map((outputName, index) => <div key = {index} > <Handle 
            id = {String(outputName)}
            type = "source"
            position = {Position.Right}
            style = {{top : OutDivFactor * (index + 1) + "%"}}
        />
        <div style={{position: 'absolute', left : 'calc(61%)', top: OutDivFactor * (index + 1)  - 5 + "%", paddingLeft : 5}}>{outputName}</div>
        </div>
        )}


        </div>
        </>

    )
}

function DeviceNodeGen({data}){
    let label = data["label"]
    return(
        <div style = {{width : '200px', height : '200px', backgroundColor : 'rgba(198, 22, 98, 0.43)', textAlign : 'center',
        borderRadius : "25px"}}>
            <h2 style = {{borderBottomStyle : "solid", fontFamily : 'monospace'}}>{label}</h2>
            <Handle     
                id = {"INPUT_HANDLE"}
                type = "target"
                position = {Position.Left}
                style = {{
                top : '125px',
                left: '5px', 
                background : '#21ad84'}}
            />     
            
        </div>
    )

}

function MethodNode({data}){
    let new_inputs = data["inputs"] 
    let label = data["label"]


    return(
            <div>
                <table  className = "Meth_Table"> 
                <thead>
                    <tr>
                        <th colSpan = {2}>{label}</th>
                    </tr>
                </thead>    
                <thead>
                    <tr>
                        <th>Main</th>
                        <th>OUTPUT</th>
                    </tr>
                </thead>
                
                <tbody>
                    {new_inputs.map((inputName, index) => 
                    <tr key = {index}>
                        <td> 
                        <div>
                            <label 
                            style = {{paddingLeft : '30px'}}
                            for = {String(inputName)}>{inputName}</label>
                            
                            
                            <Handle    
                                id = {String(inputName)}
                                type = "target"
                                position = {Position.Left}
                                style = {{
                                top : 65 + (15.5 * index) + 'px',
                                left: '5px', 
                                background : '#21ad84'}}
                            />     
                            </div>
                        </td>   
                    </tr>)}

            
                    <Handle    
                                    id = {"OUTPUT_CON"}
                                    type = "Source"
                                    position = {Position.Right}
                                    style = {{
                                    
                                    top : 65 + (13.5 * (new_inputs.length/2)) + 'px',
                                    right: '5px', 
                                    background : '#21ad84'}}
                                />  
                    
               
                    

                </tbody>   
                </table>
                

            </div> 
    )
    



}


function GenNodeTable({data, vertSize}){
    let inputs = data.inputs; 
    let outputs = data.outputs; 

    let InDivFactor = 0.8/(data.inputs.length) * 80
    let OutDivFactor = 0.2/(data.outputs.length) * 100

    // Fill out empty matchesL 
    if (inputs.length > outputs.length){
        for(let i = 0; i < inputs.length - outputs.length; i++){
            outputs.push("")
        }

    }
    else if(inputs.length < outputs.length){
        for(let i = 0; i < inputs.length - outputs.length; i++){
            inputs.push("")
        }

    }

    
    return(
        <div className = "Table_Div">
            <table className = "Node_Table">
                <thead>
                <th colSpan = {2}>{data.label}</th> 
                </thead>
                
                <thead>
                     <tr>
                        <th>Inputs</th> 
                        <th>Outputs</th> 
                    </tr>
                </thead>
                <tbody>
                    {inputs.map((inputName, index) => <tr key = {index}>
                        <td> 
                        {inputName != "" ? <div>
                            <label 
                            style = {{paddingLeft : '30px'}}
                            for = {String(inputName)}>{inputName}</label>
                            
                            
                            <Handle    
                                id = {String(inputName)}
                                type = "target"
                                position = {Position.Left}
                                style = {{
                                top : 65 + (15.5 * index) + 'px',
                                left: '5px', 
                                background : '#21ad84'}}

                            /> 
                            
                        </div>
                       :  <p></p>} 
                     </td>

    
                    <td key = {index}> 
                        {outputs[index] != "" ? <div>
                            <label 
                            style = {{paddingLeft : '30px'}}
                            for = {String(outputs[index])}>{outputs[index]}</label>
                            
                            <Handle    
                                id = {String(outputs[index])}
                                type = "source"
                                position = {Position.Right}
                                style = {{
                                top : 65 + (15.5 * index) + 'px',
                                right: '5px', 
                                background : '#21ad84'}}

                                key = {index}
                            /> 
                            
                        </div>
                       :  <p></p>} 
                     </td>
                    </tr>)}
                </tbody>
            </table> 
        </div>

    )


}


export function DeviceNode({data, vertSize}){
    const onChange = (evt) =>{
        console.log(evt.target.value)
    }

    let inputs = data.inputs; 
    let outputs = data.outputs; 
    let InDivFactor = 0.7/(data.inputs.length) * 100
    let OutDivFactor = 0.7/(data.outputs.length) * 100
    
    
    return(
        <div>
            <DeviceNodeGen data =  {{label : data.label}} />
        </div>
    )
}
    

export function MethodNodeVal({data, vertSize}){
    const onChange = (evt) =>{
        console.log(evt.target.value)
    }

    let inputs = data.inputs; 
    let outputs = data.outputs; 
    let InDivFactor = 0.7/(data.inputs.length) * 100
    let OutDivFactor = 0.7/(data.outputs.length) * 100
    
    
    return(
        <div>
            <MethodNode data = {{inputs : data.inputs, outputs : data.outputs, label : data.label}} />
        </div>
    )
}
    


export function RevisedNode({data, vertSize}){
    const onChange = (evt) =>{
        console.log(evt.target.value)
    }

    let inputs = data.inputs; 
    let outputs = data.outputs; 
    let InDivFactor = 0.7/(data.inputs.length) * 100
    let OutDivFactor = 0.7/(data.outputs.length) * 100
    
    
    return(
        <div>
            <GenNodeTable data = {{inputs : data.inputs, outputs : data.outputs, label : data.label}} />
        </div>
        
        

    )
}


// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler


// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler


let Richard_Dict = {'Stupid': {'PORT_INFO': [['17', 'LED', 'Main'], ['18', 'LED', 'Sub']], 'METHODS': {'Method1': {'VARIABLES': {'var1': 'F', 'var2': 'F', 'king3' : 'F'}, 'COMMANDS': [{'NAME': 'Sub', 'TYPE': 'LED', 'PARAMS': {'State': 'var1'}, 'METHOD': 'ACTIVE'}, {'NAME': 'Main', 'TYPE': 'LED', 'PARAMS': {'State': 'var2'}, 'METHOD': 'ACTIVE'}], 'HEADER_LIST': [['Sub', 'LED', 0], ['Main', 'LED', 1]]}, 'Method2': {'COMMANDS': [], 'VARIABLES': {"king1" : "F", "king2" : "F"}, 'HEADER_LIST': []}}}}








export function DevMethodVisualize(DeviceSystem){

    // Create the device Nodes
    let DevList = Object.keys(DeviceSystem)
    let NodeList = [] 
    let EdgeList = []
    for(let i = 0; i < DevList.length; i++){ 
        let DevName = DevList[i]
        if(DevName != 'Default'){
            let MethodList = DeviceSystem[DevList[i]]["METHODS"]
            let Method_Names = Object.keys(MethodList)
            let NodeObj = {
                id : DevName,
                type : 'DevNode', 
                position : {x : 0, y: 0}, 
                data: {label : DevName, inputs :
                ["DeviceInput"], outputs : []}
            }
        
            for(let k = 0; k < Method_Names.length; k++){
                let M_Name = Method_Names[k]
                let var_list = Object.keys(MethodList[M_Name]["VARIABLES"]) 
                
                let NodeSubObj = {
                id : M_Name,
                parent_id : DevName, 
                type : 'MethNode', 
                position : {x : 0, y: 0}, 
                data: {label : M_Name, inputs :
                var_list, outputs : ["OUT"]}
                }
                
                NodeList.push(NodeSubObj)
            
            }
            
            NodeList.push(NodeObj) 
    }
    }
    
    for(let m = 0 ; m< NodeList.length; m++){
        if(Object.keys(NodeList[m]).includes("parent_id")){
            let source_name = NodeList[m]["id"]
            let target_name = NodeList[m]["parent_id"]
            
            let NewEdge = {
                "source": source_name,
                "sourceHandle": "OUTPUT_CON",
                "target": target_name,
                "targetHandle": "INPUT_HANDLE",
                "markerEnd": {
                    "type": "arrowclosed"
                },
                "id": "reactflow__edge-"+source_name+"OUTPUT_CON-"+target_name+"INPUT_HANDLE"
            }
            
            EdgeList.push(NewEdge)
        }
        
    }
    
    return {"NodeList" : NodeList, "EdgeList" : EdgeList} 
}







const nodeListOG = [


        {
            "id": "Method1",
            "parent_id": "Stupid",
            "type": "MethNode",
            "position": {
                "x": 0,
                "y": 0
            },
            "data": {
                "label": "Method1",
                "inputs": [
                    "var1",
                    "var2"
                ],
                "outputs": [
                    "OUT"
                ]
            }
        },
        {
            "id": "Method2",
            "parent_id": "Stupid",
            "type": "MethNode",
            "position": {
                "x": 0,
                "y": 0
            },
            "data": {
                "label": "Method2",
                "inputs": ["Home"],
                "outputs": [
                ]
            }
        },
        {
            "id": "Stupid",
            "type": "DevNode",
            "position": {
                "x": 0,
                "y": 0
            },
            "data": {
                "label": "Stupid",
                "inputs": [
                    "DeviceInput", 
                    "Hope",
                ],
                "outputs": []
            }
        }
    
]




const nodeTypes = {ProcNode  : ProcessNode, RevNode : RevisedNode, MethNode : MethodNodeVal, DevNode : DeviceNode}

export function FlowChart(){


    const [king, setKing] = useState({})
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    async function MakeCall(SIM_ID){
        const uriStr = "http://127.0.0.1:5000/api/GetMDGMethodInfo/SimID=" + SIM_ID
        await axios.get(uriStr, { 
    
        })
        .then(
          response => {
            const VisObj = DevMethodVisualize(response["data"])
            const nodeList = VisObj["NodeList"]
            const edgeList = VisObj["EdgeList"] 

            setNodes(nodeList)
            setEdges(edgeList)
          })
          .catch(error => {
            return error
          })
      }
    
      useEffect(() => {
        // Update the document title using the browser API
        MakeCall(1)
      }, []);




    const onConnect = useCallback((params) => {const edgeWithArrow = {
        ...params,
        markerEnd: { type: MarkerType.ArrowClosed},
      }; 

      setEdges((eds) => addEdge(edgeWithArrow, eds));},  [setEdges]);
    
    return(
        <div style = {{ width: '100vw', height: '100vh' }}>

            <ReactFlow 
                nodes = {nodes}
                edges = {edges}
                onNodesChange = {onNodesChange}
                onEdgesChange = {onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            />
        </div>

    )
}



