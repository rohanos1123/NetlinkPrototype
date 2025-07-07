from os import name
from re import A
from flask import json
from flask.json import tag
import requests

import sys

from requests.sessions import Request
sys.path.append('/Users/noham/SystemModeler/BackendServer')

from NetLinkObject import NLObject
from DeviceDBHandler import * 
import pandas as pd
import mysql.connector

myCursor = myDB.cursor()

def SQLtoDF_FetchAll(SqlStatement):
    myCursor.execute(SqlStatement)
    qryDesc = []
    for tuple in myCursor.description: 
        qryDesc.append(tuple[0])

    queryFile = myCursor.fetchall()
    index_match = 0

    qry_df = {} 
    print(qryDesc)
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


# Instantiate the Objects: 

class NetLinkSystem: 
    def __init__(self, in_simID): 
        self.SimulationName = " "
        self.ObjectDict = {}
        self.DeviceDict = {} 
        self.DeviceDictTotal = {}
        self.DeviceApiList = {} 
        self.cycle = 0 
        self.simID = in_simID
        self.DeviceHandler = DeviceDBHandler() 

    
    

    def Initiate(self): 
        # Begin by pulling the objects from the database with the given simID 
        qryStatement = "SELECT * FROM OBJECTS WHERE SIMULATION_ID = %s" 
        qryStatement = qryStatement % (self.simID, )
        object_df = SQLtoDF_FetchAll(qryStatement)
        
        # maps the default of an type to a default value (if write activates before variable update)
        Default_Type_Map = {"I" : 5, "F" : 0.2, "str" : "ON", "CMD" : True}

        # Then, pull the database objects from the mongoDB database: 
        self.DeviceDict = self.DeviceHandler.RetrieveProcessDataMenu(sim_id = int(self.simID))

        # Generate the device dictionaries for METHODS that are in the system, not any other bullshit: 
        self.DeviceDictTotal = self.DeviceDict.copy()
        self.DeviceDict = {}
        
        # Creation of the DeviceAPIDict (for passing to the MongoDB execution layer)

        for Device_Name in self.DeviceDictTotal: 
            if Device_Name != "Default": 
                for key, value in self.DeviceDictTotal[Device_Name]["METHODS"].items(): 
                    Method_Variables = {}
                    for key2, value2 in value["VARIABLES"].items(): 
                        Method_Variables.update({key2 : Default_Type_Map[value2]})

                    Device_Item = {"Device_name" : Device_Name, "Method" : key, "Input_Vals" : Method_Variables}
                    self.DeviceApiList.update({(Device_Name, key) : Device_Item})
                

        # Creation of the device dict         

        for key, value in self.DeviceDictTotal.items(): 
            if key != "Default": 
                for method_name in list(value["METHODS"].keys()): 
                    self.DeviceDict.update({method_name : key})

        for idx, rows in object_df.iterrows(): 
            object_name = rows["NAME"]
            object_simulation_id = rows["OBJECT_ID"]

            new_Obj = NLObject()
            new_Obj.CreateObject(self.simID, object_simulation_id)

            self.ObjectDict.update({object_name : new_Obj})

    # TODO: MUST PRODUCE AN API DATA OBJECT CONTAINING THE OBJECT DICT OF THE FORM: 
    # {Device_name : DEVICE-ONE, Method : FLASH_BOTH, Input_Vals: {var1: 10, var2: 20, var3: 30}


    def ExecuteStep(self): 
        # begin execution stage and store all links between transfers
        recordLine = []
        Obj_List = list(self.ObjectDict.keys()) 
      
        # Address the execution (data forwarding) of objects
        for object in Obj_List: 
            newData = self.ObjectDict[object].ObjectExecute() 
            if(newData != "ERROR, COMMAND INPUT NOT FOUND"):
                recordLine.append(newData)

        # TODO: Address the execution of device methods: 

        for key, value in self.DeviceApiList.items(): 
           if value["Input_Vals"]["Activator"] == True:
                # Device Execution Instructions: 
                Device_Struct = self.DeviceHandler.ExecuteModel(1, value)
                Device_IP = Device_Struct["IP_ADDRESS"]
                Device_Commands = json.dumps({"COMMANDS" : Device_Struct["Commands"], "PORT_MAP" : Device_Struct["Port_Map"]}) 
                print("Yoooo: ", Device_Commands)

                request_header = {'Content-Type': 'application/json'}
                dev_url_str = "http://" + Device_IP + ":5000/ExecuteOrder"
                try: 
                    # Send the device commands to the dev_url
                    dev_response = requests.post(dev_url_str, data=Device_Commands, headers=request_header)
                    dev_response.raise_for_status() 
                    print('Response: ', dev_response.text)
                except requests.exceptions.RequestException as e:
                    print("Failure Bug: ", e) 

        
        # load the recordLine into the appropriate nodes and input addresses: 
        for fwdRec in recordLine: 
            # parse record 
            fwd_node = fwdRec[1].split(":")[0]
            fwd_port = fwdRec[1].split(":")[1]

            resultant_dict = {fwd_port : fwdRec[0]}
            #print(self.DeviceDict)

            if fwd_node in self.ObjectDict.keys(): 
                # Select the Object from the Object Dict 
                self.ObjectDict[fwd_node].ApplyInputs(resultant_dict)
            elif fwd_node in self.DeviceDict.keys(): 
                # Extract the Parent Device from the DeviceDict:  
                method = fwd_node 
                device = self.DeviceDict[fwd_node]
                qry_tuple = (device, method)

                self.DeviceApiList[qry_tuple]['Input_Vals'][fwd_port] = fwdRec[0]


    def GetObjectList(self):
        return self.ObjectDict


TestSystem = NetLinkSystem(1) 
TestSystem.Initiate()
TestSystem.GetObjectList()['home'].ApplyInputs({'AddCmd' : True, 'in1' : "5",  'in2' : "0.10"})

TestSystem.ExecuteStep() 


            



