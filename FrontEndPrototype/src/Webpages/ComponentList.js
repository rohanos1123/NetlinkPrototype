import { Component, useCallback } from "react";
import {Handle, Position} from 'reactflow'

export function TextInputNode({data}){
    const onChanfge = useCallback((e)=>{
        console.log(e.target.value)
    }, [])
    return ( <>
    <Handle type="source" position={Position.Left}/>
    <div>
        <p>Custom Node title</p>
        <input id ="input" name = "text"></input>
    </div> 
    <Handle type="target" position={Position.Right} /> 
    
    </>)
}


export class TextBox extends Component{
    constructor(props){
        super(props);
        this.state = {TextEntry : " "}; 
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleSubmit(e){
        e.preventDefault(); 
        this.props.i_onSubmit(this.state.TextEntry);
    }

    handleChange(e){
        this.setState({TextEntry : e.target.value})
    }

    render(){
        return(
        <div> 
            <form onSubmit = {(e) => this.handleSubmit(e)}>
            <label for="attachment">{this.props.label}</label>
            <input id = "attachment" type="text" onChange = {(e) => this.handleChange(e)} value = {this.state.TextEntry}/>
            {this.props.renderVal ? <label for ="attachment">{this.state.TextEntry}</label> : null}
            <input type="submit" value = "ApplyChanges"/> 
            </form>
        </div> 
        )
    }
}

export class TextEntry extends Component{
    constructor(props){
        super(props)
        this.state = {
            TextEntry : " "
        }
    }

    handleChange(e){
        this.setState({TextEntry : e.target.value})
        this.props.i_onChange(e.target.value)
    }

    render(){
        return(
            <div>
                <label for = "EntryBox">{this.props.label}</label>
                <input type = "Text" onChange = {(e) => this.handleChange(e)} id = "EntryBox" value = {this.state.TextEntry}/>
            </div>
        )
    }

}

export class Buttons extends Component{
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    
    handleClick(){
        this.props.i_onClick() 
    }
    render(){
        return(
            <div>
                <button onClick = {this.handleClick}>{this.props.name}</button>
            </div>
        )
    }
}

// Used For debugging Purposes
export class DisplayText extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <p>{this.props.value}</p>
            </div>
        )
    }
}


export class VariableMenu extends Component{
    constructor(props){
        super(props)
        this.state = {
            varName : "Default Name",
            is_aggregate : true, 
            initial_value : 0
        }
    }

    onChangeCheck(){
        this.setState({is_aggregate : !this.is_aggregate})
    }

    onChangeName(newVal){
        this.setState({varName : newVal})
    }

    onChangeInitVal(newVal){
        this.setState({initial_value : newVal})
    }

    handleSubmit(e){
        e.preventDefault(); 
        let defInterface = {
            "VarName" : this.state.varName, 
            "InitVal" : this.state.initial_value, 
            "IsAggregeate" : this.state.is_aggregate
        }
        this.props.addToList(defInterface)



    }

    render(){
        return(
            <div className = "VariableMenu" style = {{display: "grid", justifyContent :  "center", position:"fixed", bottom:"10%", left:"50%", right: "50%"}} > 
            <form onSubmit = {(e) => this.handleSubmit(e)}> 
                <h3 style = {{marginLeft : 90}}>Create a new variable: </h3>
                <div style={{display : "flex" }}>
                <div style={{paddingRight : 15}}>
                <TextEntry  label = {" Variable Name: "} i_onChange = {(k) => this.onChangeName(k)}/>
                </div>
                <TextEntry  label = {" Initial Value:  "} i_onChange = {(k) => this.onChangeInitVal(k)}/>
                </div>
                <br></br>
                <div style = {{display : "flex"}}> 
                <label for = "AgBox" >Aggregate Variable: </label> 
                <input id = "AgBox" type="checkbox" checked = {this.state.is_aggregate} onChange = {this.onChangeCheck}/>
                </div>
                <br></br>
                <input type = "submit" value = "Apply Changes" style = {{padding: 14, marginLeft:180}} />
            </form> 
             </div> 
        )
    }
}


export class FunctionMapForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            functionMap : {},
            resetChild : false 
        }
        for(let i = 0; i < this.props.OutPutVars.length; i++){
            this.state.functionMap[this.OutPutVars.size[i]] = "0"
        }

    }

    onRuleChange(e){
        const tempCopy = this.state.functionMap
        tempCopy[e.target.name] = e.target.value 
        this.setState({functionMap : tempCopy})
    }
    
    handleFormSubmit(e){
        e.preventDefault()
        this.props.formContainer(this.state.functionMap)
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (prevProps.resetChild !== this.props.resetChild && this.props.resetChild) {
          this.setState({functionMap : {}})
        }
      }
    

    render(){
        return(
            <div>
            <form onSubmit = {(e) => this.handleFormSubmit(e) } >
            <input type="submit" value = "Apply Changes"/>
            <nav style = {{marginRight : 100}}>
                <ul style={{paddingLeft : 0, backgroundColor:"#0b4e6e"}}>
            {this.props.OutPutVars.map((name, index) => 
                <li><div key={index}>
                    <label id = "speciaLabel" for="TextEntry">{name} = </label>
                    <input id = "TextEntry" type="text" name = {name} onChange = {(e) => this.onRuleChange(e)} />
                    <br></br>
                </div>
                </li>

                )}
                </ul>
            </nav>
            </form> 
            </div>
        )   
    }
}



class Form extends Component{
    constructor(props){
        super(props); 
        this.state = {
            FormValue : ""
        }
    }

    handleChange(e){
        this.setState({FormValue : e.target.value}); 
    }

    handleSubmit(e){
        e.preventDefault(); 
        this.setState({FormValue : e.target.value}, 
        this.props.AssignValue(this.state.FormValue)); 
      
    }

    render(){
        return(
            <div>
                <form onSubmit = {(e)=>this.handleSubmit(e)}>
                    <label for="TextForm">{this.props.label}</label>
                    <input type="text" placeholder = {this.props.label} value = {this.state.FormValue}
                    onChange = {(e)=>this.handleChange(e)} />
                    <input type="submit" value = {"Apply"} />
                </form> 
            </div> 



        )


    }
}







export class ProcessMenu extends Component{
    constructor(props){
        super(props) 
        this.state = {
            //Main Variables
            ProcessName : "", 
            OutPutVars : [], 
            functionMap : {}, 
            inVarMap : {}, 
            initialTime : 1, 
            procTime : 1, 
            resetTime : 1,
            extractedVars : [], 

            
            
            
            //Temp Variables
            varNameTemp : " "

        }
    }

    handleNameChange(e){
        this.setState({ProcessName : e.target.value})
    }

    handleOutVarName(e){
        this.setState({varNameTemp : e.target.value})
    }

    handleVariableAddition(e){
        e.preventDefault() 
        const OPVCopy = this.state.OutPutVars.slice()
        let variableName = this.state.varNameTemp 
        let isInList =  true
        // Check if variable is still in the variable list (maybe use bin search instead?): 
        /*
        for (let i = 0; i < this.props.variableList.size; i++){
            if(this.props.variableNameList[i] == variableName){
                isInList = true 
            }
        }
        */

        if(isInList){
            OPVCopy.push(variableName)
            this.setState({OutPutVars : OPVCopy}, console.log(this.state.OutPutVars))
            this.setState({varNameTemp : ""}, console.warn(this.state.varNameTemp))
        }

        
        //Handle exception where new variable name is not in the provided set: 
    }

    handleResetChild() {
        this.setState({ resetChild: true }, () => {
          this.setState({ resetChild: false });
        });
      }


    functionHandler(e){
        console.log(e)
        this.setState({functionMap : e}, () =>{
            const takenSymbols = ['sin', 'cos', 'tan', 'exp']
            let TempExtractedVars = new Set()
            let lmar = []
            for (const key in this.state.functionMap){
                    const targ_string  = this.state.functionMap[key]
                    const regex = /[a-zA-Z]+/g; 

                    lmar = targ_string.match(regex)

            if(lmar != null){
                for(let i = 0; i < lmar.length; i++){
                    let exString = lmar[i]
                    if(!takenSymbols.includes(exString)){
                    TempExtractedVars.add(exString)
                 }
                }
            }
        }
        const newArry = Array.from(TempExtractedVars)
        this.setState({extractedVars : newArry})
        }) 

        console.log(this.state.extractedVars) 
        
    }


    outAssignmentHandler(e){
        this.setState({inVarMap : e})
        console.log(this.state.inVarMap)
    }

    handleVarSubmit(e){
        e.preventDefault(); 
        this.props.handleSubmit(this.state)
        this.setState({OutPutVars : [], functionMap : {}, extractedVars : [], inVarMap : {}})
        this.handleResetChild()
    }



    render(){
        return(
            <div>
            <h3 style = {{textAlign : "center", position:"absolute", bottom : 100}}>Process Menu</h3>
            <div className = "ProcessMenu" style = {{display: "inline-flex", position: "absolute",bottom: "0px",width: "100%",justifyContent: "flex-end"}}> 
                <div style = {{display : "flex"}}>
                <div style = {{display : "inline", paddingRight : 30}}>
                <label for = "pn" >Set Process Name: </label>
                <input id = "pn" type = "text" placeholder = "Process Name" onChange = {(e) => this.handleNameChange(e)}
                value = {this.state.ProcessName}/>
                </div>
                    <div>
                    <form id = "OV"  onSubmit = {(e)=>this.handleVariableAddition(e)}>
                        <label for = "OV">Output Variables: </label>
                        <input type="text" placeholder = "Type output Variable here" 
                        value = {this.state.varNameTemp} onChange = {(e) => this.handleOutVarName(e)}/>
                        <input type = "Submit" value = "Add Variable"/> 
                    </form> 
                    </div>
                    </div>
                    <br></br>
                <div className = "Function Mapping" style = {{display : "flex", bottom:"10%"}}>  
                    <p></p>
                    
                    <span style = {{paddingLeft:40}}> 
                    <label for = "pid">Set Ouputs</label>
                    <FunctionMapForm id = "pid" OutPutVars = {this.state.OutPutVars} formContainer = {(e) => this.functionHandler(e)} resetChild = {this.state.resetChild}/>
                    </span>
                    
                    <span style = {{paddingLeft : 40}}>
                    <label for = "pid2">Name Map</label>
                    <FunctionMapForm id = "pid2" OutPutVars = {this.state.extractedVars} formContainer = {(e) => this.outAssignmentHandler(e)} resetChild = {this.state.resetChild}/>
                    </span> 
                    <input type = "button" value = "Add" onClick = {(e) => this.handleVarSubmit(e)}/>
            </div>


            </div>  
            </div>  
            

        )
    }


}

export class RadioSelect extends Component{
    constructor(props){
        super(props)
        this.state = {
            chooseOption : this.props.Options[0]
        }
    }

    onSelect(e){
        this.setState({chooseOption : e.target.id}, 
            this.props.onSelect(e.target.id))
    }
    
    render(){
        return(
            <div>
                {this.props.Options.map((option, key) => 
                <div key = {key}>
                <label for = {option}>{option}</label>
                <input id = {option} type="radio" name = "typeSelect" value={this.option} onChange = {(e) => this.onSelect(e)}/>
                <br></br>
                </div>
                )}
            </div>
        )
    }

}











