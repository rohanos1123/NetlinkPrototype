import certifi
from pymongo.mongo_client import MongoClient


# Establish the initial condition for the mongoDB database
class DevMongoClient:
    def __init__(self):
        self.uri = "mongodb+srv://simUser:Raor11232002!@ctstore.pzqy3gs.mongodb.net/?retryWrites=true&w=majority"
        # Create a new client and connect to the server
        self.client = MongoClient(self.uri, tlsCAFile=certifi.where())
        self.dbCursor = self.client["NetlinkTest"]
        self.dbColNames = self.dbCursor.list_collection_names()[0]
        self.ColCursor = self.dbCursor[self.dbColNames]


    def InsertObjectList(self, NewObject):
        try:
            self.ColCursor.insert_many(NewObject)
            print("Addition Successful!")
        except:
            raise KeyError("Insertion into MongoDB device database failed!")


    def CLEAR_COLLECTION(self):
        try:
            self.ColCursor.delete_many({})
            print("All Device Records DELETED")
        except:
            raise KeyError("Issue deleting the Device Records")


    def RemoveDEVOBJ(self, SimID, Name):
        try:
            Query_Dict = {'SIMULATION_ID': SimID, 'NAME': Name}
            self.ColCursor.delete_one(Query_Dict)
        except:
            raise KeyError("Deletion from MongoDB failed! ")

    # Removes all the Device Objects with given sim from the MONGO DB Database
    def Remove_DEV_OBJ_SIM(self, SimID):
        try:
            Query_Dict = {'SIMULATION_ID': SimID}
            self.ColCursor.delete_one(Query_Dict)
        except:
            raise KeyError("Deletion from MongoDB failed! ")

    def GetSimDEVOBJ(self, SimID):
        try:
            Query_Dict = {'SIMULATION_ID': SimID}
            Dev_List = []
            for ColSym in self.ColCursor.find(Query_Dict, {"_id": 0}):
                Dev_List.append(ColSym)
            return Dev_List
        except:
            raise KeyError("MongoDB query failure ")


    def GetDEVOBJ(self , SimID, dev_name):
        try:
            Query_Dict = {"SIMULATION_ID": SimID, "NAME": dev_name}
            return self.ColCursor.find(Query_Dict, {"_id": 0})[0]
        except:
            raise KeyError("MongoDB Query Fail")


    def GetCursor(self):
        return self.ColCursor


    # Sample API: {Device_name : DEVICE-ONE, Method : FLASH_BOTH, Input_Vals: {var1: 10, var2: 20, var3: 30}
    def ExecuteDevNode(self, Sim_ID, API_Dict):
        Dev_Name = API_Dict['Device_name']
        Dev_Method = API_Dict["Method"]
        in_dict = API_Dict["Input_Vals"]
        
        Device_Dict = self.GetDEVOBJ(Sim_ID, Dev_Name)

        # Create the port dictionary:
        port_info = Device_Dict["PORT_INFO"]
        ip_grab = Device_Dict["IP_ADDRESS"]
        port_dict = {}
        for port in port_info:
            p_desc = [port[0], port[1]]
            port_dict.update({port[2]: p_desc})

        method_dict = (Device_Dict["METHODS"])[Dev_Method]

        Sub_Command_List = []
        for Object in method_dict["COMMANDS"]:
            num = port_dict[Object["NAME"]][0]
            dev_type = Object["TYPE"]
            method_name = Object["METHOD"]
            param_copy = Object["PARAMS"]
            for key, value in Object["PARAMS"].items():
                param_copy[key] = in_dict[value]

            cmd_entry = {
                'PORT': num,
                'DEV_TYPE': dev_type,
                'METHOD': method_name,
                'PARAMS': param_copy
            }

            Sub_Command_List.append(cmd_entry)
        return {"IP_ADDRESS" : ip_grab, "Commands" : Sub_Command_List, "Port_Map" : port_info}

    def GetDevNodeVisuals(self, Sim_ID):
        qry_list = self.GetSimDEVOBJ(Sim_ID)
        # Dev Names
        dev_names = []

        # Method_Dict
        Method_Dict_List = []

        for dev in qry_list:
            dev_names.append(dev['NAME'])
            dev_names.update(dev)
            Port_Names = dev["PORT_INFO"]

            # Device the Method List:
            Method_Dict = dev['METHODS']
            for key, SubDict in Method_Dict:
                name = key
                cmd_instr = SubDict['COMMANDS']

            Method_Dict_List.append(Method_Dict)



# kill kode: 
#kill = DevMongoClient() 
#kill.CLEAR_COLLECTION() 















hiters_bunker = Device_List = [

            {
                "NAME" : "DEVICE-ONE", 
                "SIMULATION_ID" : 1,
                "PORT_INFO": [[14, "LED", "PORT1"], [12, "LED", "PORT2"]],
                 "METHODS": {
                        "FLASH_BOTH_1" : {
                        "COMMANDS": {"PORT1": {"FLASH": {"Rate": "var1", "Duration": "var2"}},
                                    "PORT2" : {"ACTIVE": {"State": "varVersion1"}}},
                        "INPUTS": [[0, "varVersion", "F"], [1, "varVersion1", 'F'], [2, "varVersion1", "str"]]
                        }
                    }
                },

                {
                "NAME" : "DEVICE-two",
                "SIMULATION_ID" : 2,
                "PORT_INFO": [[14, "LED", "PORT1"], [12, "LED", "PORT2"]],
                 "METHODS": {
                        "FLASH_BOTH_2" : {
                        "COMMANDS": {"PORT1": {"FLASH": {"Rate": "var1", "Duration": "var2"}},
                                    "PORT2" : {"ACTIVE": {"State": "varVersion1"}}},
                        "INPUTS": [[0, "varVersion", "F"], [1, "varVersion1", 'F'], [2, "varVersion1", "str"]]
                        }
                    }
                }

        ]















