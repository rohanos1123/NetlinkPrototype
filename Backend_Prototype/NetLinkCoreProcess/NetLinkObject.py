from PrimFuncHanlder import evalFuncString
from os import name
from flask import json
from flask.json import tag
import pandas as pd
import mysql.connector





mySys= mysql.connector.connect(
  host="127.0.0.1",
  user="root",
  password="Raor11232002!", 
)


myDB = mysql.connector.connect(
    host = "127.0.0.1",
    user="root",
    password = "Raor11232002!",
    database="ChronetexDB"
)

myCursor = myDB.cursor()

def SQLtoDF_FetchAll(SqlStatement):
    myCursor.execute(SqlStatement)
    qryDesc = []
    for tuple in myCursor.description: 
        qryDesc.append(tuple[0])

    queryFile = myCursor.fetchall()
    index_match = 0

    qry_df = {} 
    index_match_dict = {}


    for col in qryDesc: 
        index_match_dict.update({index_match : col})
        qry_df.update({col : []})
        index_match += 1


    for tuple in queryFile:
        for index in range(len(tuple)):
            entry = tuple[index]
            col = index_match_dict[index]
            qry_df[col].append(entry)
    
    
    qry_df = pd.DataFrame.from_dict(qry_df)

    return qry_df




# Multiple instance columns 
# Register Functions, Command Inputs, 

class NLObject:
    def __init__(self):
        self.ObjectName = ""
        self.ExecString = ""

        # One off unique datastructures (Unique Names in table)
        self.Value_Inputs = {} 
        self.Command_Inputs = {}
        self.Registers = {} 

        # Does not contain dynamic data structures needs Pandas DF to perform queries 
        self.CommandMappings = {}
        self.OutputFunctions = {}
        self.RegisterFunctions = {}

    # Add more to the default type as you go on
    def GetDefaultVal(self, in_type):
        if in_type == "F":
            return 0 
        elif in_type == "str":
            return ""

    def CreateObject(self, ObjectID, Sim_ID):
        # Query the System Database for the Correct ObjectID
        qryTuple = (ObjectID, Sim_ID)
        qryString = "SELECT * FROM INPUT_VALUES WHERE SIMULATION_ID = %s AND OBJECT_ID = %s"
        qryString = qryString %  qryTuple
        inputs_df = SQLtoDF_FetchAll(qryString)
        pos_id = 0
        for idx, in_rows in inputs_df.iterrows():
            if in_rows["INPUT_TYPE"].upper() == "CMD": 
                cmd_name = in_rows["INPUT_NAME"]
                self.Command_Inputs.update({cmd_name : [pos_id, False]})
                pos_id = pos_id + 1
                
            else: 
                in_name = in_rows["INPUT_NAME"] 
                in_type = in_rows["INPUT_TYPE"]
                in_value = self.GetDefaultVal(in_type)
                self.Value_Inputs.update({in_name : [in_value, in_type]})

            




        qryTuple = (ObjectID, Sim_ID)
        qryString = "SELECT * FROM REGISTERS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s"
        qryString = qryString %  qryTuple
        Register_df = SQLtoDF_FetchAll(qryString)
        for idx, reg_rows in Register_df.iterrows(): 
            reg_name = reg_rows["REGISTER_NAME"]
            reg_type =  reg_rows["REGISTER_TYPE"]
            reg_initval = reg_rows["REGISTER_INITVAL"]
            self.Registers.update({reg_name : [reg_initval, reg_type]})



        qryTuple = (ObjectID, Sim_ID)
        qryString = "SELECT * FROM REGISTER_FUNCTIONS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s"
        qryString = qryString %  qryTuple
        self.RegisterFunctions = SQLtoDF_FetchAll(qryString)

        qryTuple = (ObjectID, Sim_ID)
        qryString = "SELECT * FROM OUTPUT_FUNCTIONS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s"
        qryString = qryString %  qryTuple
        self.OutputFunctions = SQLtoDF_FetchAll(qryString)

        qryTuple = (ObjectID, Sim_ID)
        qryString = "SELECT * FROM COMMAND_MAPPINGS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s"
        qryString = qryString %  qryTuple
        self.CommandMappings = SQLtoDF_FetchAll(qryString)
        

    def getRegisterDict(self):
        reg_func_var_dict = {} 
        for val_in in self.Value_Inputs.keys(): 
            reg_func_var_dict.update({val_in : self.Value_Inputs[val_in]})

        for reg_var in self.Registers.keys(): 
            reg_key = "r." + reg_var
            reg_func_var_dict.update({reg_key : self.Registers[reg_var]})
        
        return reg_func_var_dict



    def getOutputDict(self): 
        out_func_dict = {} 

        for reg_var in self.Registers.keys(): 
            out_func_dict.update({reg_var : self.Registers[reg_var]})
        
        return out_func_dict

    def ApplyInputs(self, new_in_dict):
        for key in new_in_dict.keys(): 
            in_val = key in self.Value_Inputs.keys() 
            in_cmd = key in self.Command_Inputs.keys()

            if in_val: 
                self.Value_Inputs[key][0] = new_in_dict[key]

            if in_cmd: 
                self.Command_Inputs[key][1] = new_in_dict[key]

    def setExecString(self, e_str): 
        self.ExecString = e_str

            
    # The staging 
    def ObjectExecute(self):
        #  List of address data tuples containing info on return 

        # Read the results from the command map and determine the exectution 
        ogString = []
        execString = ""
        for sum in range(len(self.Command_Inputs.keys())): ogString.append("0")

        for var in self.Command_Inputs: 
            posLocation = self.Command_Inputs[var][0]
            if self.Command_Inputs[var][1] == True: 
                ogString[posLocation] = "1"
            else:
                ogString[posLocation] = "0"

        for item in ogString: 
            execString += item

            

            
        self.setExecString(execString)
        out_result_tuple = () 

        # Set the register function variable dict (CONTAINS inputs and r.+register)
        reg_func_var_dict = self.getRegisterDict()
        out_func_dict = self.getOutputDict()
        
    
    
        # Read the ExecString and determine if it exists in the dictionary: 
        Command_SubDF = self.CommandMappings[self.CommandMappings["EXECUTION_STR"] == self.ExecString]
        if not Command_SubDF.empty: 
            # Read the register function 
            for idx, cmd_rows in Command_SubDF.iterrows():
                Register_Function = cmd_rows["REGISTER_FUNCTION"]
                output_port = cmd_rows["SOURCE_PORT"]
                dest_Node = cmd_rows["DEST_NODE"]
                dest_Port = cmd_rows["DEST_PORT"]
                dest_loc_string = dest_Node  + ":" + dest_Port 

                # Extract the the register function 
                RegFunc_df = self.RegisterFunctions[self.RegisterFunctions["FUNCTION_NAME"] == Register_Function]
                Output_df = self.OutputFunctions[self.OutputFunctions["OUTPUT_NAME"] == output_port]
                
                # Parse the Register Function and change the values of the register_function
                for idx, rows in RegFunc_df.iterrows(): 
                    reg_func_rule = rows["REGISTER_FUNCTION_RULE"]
                    reg_func_applies =  rows["APPLIES"]
                    # Extract the register function 
                    res = evalFuncString(reg_func_rule, reg_func_var_dict)
                    result_value = list((res[0][0], res[1]))
                    self.Registers[reg_func_applies] = result_value 

                # Perform the valid calculations for the output port: 
                for idx, out_rows in Output_df.iterrows():

                    # Read the output rule 
                    output_rule  = out_rows["OUTPUT_FUNCTION_RULE"]
                    output_type = out_rows["OUTPUT_TYPE"]

                    out_func_dict = self.getOutputDict()

                    res = evalFuncString(output_rule, out_func_dict)
                    output_result = list((res[0][0], res[1]))

                    # load the exit tuple: 
                    out_result_tuple = (output_result, dest_loc_string)

                    # Evaluate Cost function: 
                    CostRegister = out_rows["COST_REGISTER"]
                    CostFunction = out_rows["COST_FUNCTION"]

                    out_func_dict = self.getOutputDict()

                    cost_result = evalFuncString(CostFunction, out_func_dict)
                    self.Registers[CostRegister] = list((cost_result[0][0], cost_result[1]))

            return out_result_tuple
        else:
            return "ERROR, COMMAND INPUT NOT FOUND"



            

                



                
                 

            


        # Search the Command Inputs for the executionString by putting into a 





