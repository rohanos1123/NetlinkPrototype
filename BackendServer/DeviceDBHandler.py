import MongoDBHandler


# Sample Diction
Sample_Dictionary = {
    "Default": {
        "PORT_INFO": [],
        "METHODS": {
            "Method1": {}
        }
    },
    "Stupid": {
        "IP_ADDRESS" : "192.168.1.21",
        "PORT_INFO": [
            [
                "17",
                "LED",
                "Main"
            ],
            [
                "18",
                "LED",
                "Sub"
            ]
        ],
        "METHODS": {
            "Method1": {
                "VARIABLES": {
                    "var1": "F",
                    "var2": "I",
                    "Activator" : "CMD"
                },
                "COMMANDS": [
                    {
                        "NAME": "Sub",
                        "TYPE": "LED",
                        "PARAMS": {
                            "Rate": "var1",
                            "Duration" : "var2"
                        },
                        "METHOD": "FLASH"
                    },
                    {
                        "NAME": "Main",
                        "TYPE": "LED",
                        "PARAMS": {
                            "Rate": "var1",
                            "Duration" : "var2"
                        },
                        "METHOD": "FLASH"
                    }
                ],
                "HEADER_LIST": [
                    [
                        "Sub",
                        "LED",
                        0
                    ],
                    [
                        "Main",
                        "LED",
                        1
                    ]
                ]
            },
            "Method2": {
                "COMMANDS": [],
                "VARIABLES": {"Activator" : "CMD"},
                "HEADER_LIST": []
            }
        }
    }
}

class DeviceDBHandler:
    def __init__(self):
        self.MGClient = MongoDBHandler.DevMongoClient()

    # insertion Process 1 "Process, Delete Sim Items, Insert Sim Items
    # Processes Dictionary and outputs the

    def ProcessDictionary(self, INFO_DICT, Account_Name, Sim_ID):
        RevisedInfoDict = INFO_DICT.copy()
        temp = RevisedInfoDict.pop("Default")
        NosCritic = []
        for key_name in RevisedInfoDict.keys():
            NewDict = RevisedInfoDict[key_name]
            NewDict.update({"NAME" : key_name})
            NewDict.update({"ACCOUNT_NAME": Account_Name})
            NewDict.update({"SIMULATION_ID": Sim_ID})

            NosCritic.append(NewDict)
        return NosCritic

    def InsertDict(self, in_InfoDict, in_Acc_Name, in_Sim_ID):
        try:
            ProcDict = self.ProcessDictionary(in_InfoDict, in_Acc_Name, in_Sim_ID)
            # Delete Items from DB:
            self.MGClient.Remove_DEV_OBJ_SIM(in_Sim_ID)
            # Add new Items into DB
            self.MGClient.InsertObjectList(ProcDict)
        except:
            raise KeyError("Dict Insertion Failure!")

    # Retrieval Process Data
    def PreProcRecords(self, Pass_Dict):
        Dev_Name = Pass_Dict.pop("NAME", None)
        Pass_Dict.pop("ACCOUNT_NAME", None)
        Pass_Dict.pop("SIMULATION_ID", None)
        Dict_Copy = {Dev_Name : Pass_Dict}

        return Dict_Copy

    # EXECUTE EXECUTE
    def ExecuteModel(self, SIM_ID, API_DIRECTIVE):
        return self.MGClient.ExecuteDevNode(SIM_ID, API_DIRECTIVE)

    # Retrieve Processed Data for Menu Purposes:
    def RetrieveProcessDataMenu(self, sim_id):
        Get_List = self.MGClient.GetSimDEVOBJ(sim_id)
        Sim_Proc_Dict = {}
        for sub_dict in Get_List:
            Sim_Proc_Dict.update(self.PreProcRecords(sub_dict))
        return Sim_Proc_Dict



# Sample API: {Device_name : DEVICE-ONE, Method : FLASH_BOTH, Input_Vals: {var1: 10, var2: 20, var3: 30}
# SampleAPI : {

'''
king = DeviceDBHandler()
king.InsertDict( Sample_Dictionary, "Rohan", 1)
''' 





















































