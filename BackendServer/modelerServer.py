from DeviceMethods import Dev_Handshake
from DevLibReader import * 
from DeviceDBHandler import * 
from os import name
from flask import json
from flask.json import tag
import mysql.connector
from flask import Flask, jsonify
from flask import request
from flask_cors import CORS 
import re


'''
DATABASE AND TABLE INITIALIZATION
'''
mySys= mysql.connector.connect(
  host="127.0.0.1",
  user="root",
  password="####", 
)


myDB = mysql.connector.connect(
    host = "127.0.0.1",
    user="root",
    password = "####",
    database="ChronetexDB"
)

app = Flask(__name__)
CORS(app)
MDB_Handler = DeviceDBHandler()



# Initialization of Database! (ONLY NEEDED ONCE!)

'''
# Database Initialization
mySyscursor.execute("CREATE DATABASE ChronetexDB")
mySyscursor.execute("SHOW DATABASES")
king = mySyscursor.fetchall()
print(king)
'''




#Initialization of tables (ONLY NEEDED ONCE!)
myCursor = myDB.cursor(buffered=True)


myCursor.execute("DROP TABLE IF EXISTS Accounts")
myCursor.execute("DROP TABLE IF EXISTS Simulations")
myCursor.execute("DROP TABLE IF EXISTS OBJECTS")
myCursor.execute("DROP TABLE IF EXISTS REGISTERS")
myCursor.execute("DROP TABLE IF EXISTS REGISTER_FUNCTIONS")
myCursor.execute("DROP TABLE IF EXISTS OUTPUT_FUNCTIONS")
myCursor.execute("DROP TABLE IF EXISTS INPUT_VALUES")
myCursor.execute("DROP TABLE IF EXISTS COMMAND_MAPPINGS")
myCursor.execute("DROP TABLE IF EXISTS VISUAL_OBJ")




myCursor.execute("CREATE TABLE OBJECTS (SIMULATION_ID INTEGER, OBJECT_ID INTEGER UNIQUE AUTO_INCREMENT, NAME VARCHAR(255) UNIQUE)") 

myCursor.execute("CREATE TABLE ACCOUNTS (Email VARCHAR(255), Username VARCHAR(255) UNIQUE, Password VARCHAR(255), CreatorTags VARCHAR(255), Description VARCHAR(255))")
myCursor.execute("CREATE TABLE SIMULATIONS (SIMULATION_ID INTEGER, SIMULATION_NAME VARCHAR(255), OWNER_ID INTEGER, OWNER_NAME VARCHAR(255),  CREATED DATE, SIMTAGS VARCHAR(255))")



myCursor.execute(
    '''
    CREATE TABLE REGISTERS (SIMULATION_ID INTEGER, OBJECT_ID INTEGER, REGISTER_ID INTEGER UNIQUE AUTO_INCREMENT, REGISTER_NAME VARCHAR(255), 
    REGISTER_TYPE VARCHAR(20), REGISTER_INITVAL VARCHAR(20))
    
    '''
)


myCursor.execute(
    '''

    CREATE TABLE REGISTER_FUNCTIONS (SIMULATION_ID INTEGER, OBJECT_ID INTEGER, REGISTER_FUNCTION_ID INTEGER AUTO_INCREMENT UNIQUE, 
    FUNCTION_NAME VARCHAR(255), REGISTER_FUNCTION_RULE VARCHAR(255),  APPLIES VARCHAR(255))

    '''
)

myCursor.execute(

    '''
        CREATE TABLE OUTPUT_FUNCTIONS (OUTPUT_FUNCTION_ID INTEGER UNIQUE AUTO_INCREMENT, SIMULATION_ID INTEGER, OBJECT_ID INTEGER, 
        OUTPUT_NAME VARCHAR(255), OUTPUT_TYPE VARCHAR(20), OUTPUT_FUNCTION_RULE VARCHAR(255), COST_REGISTER VARCHAR(255), COST_FUNCTION VARCHAR(255))
    
    '''
)

myCursor.execute(
    '''
        CREATE TABLE INPUT_VALUES (ID INTEGER UNIQUE AUTO_INCREMENT, SIMULATION_ID INTEGER, OBJECT_ID INTEGER, POSID INTEGER, INPUT_NAME VARCHAR(255), 
        INPUT_TYPE VARCHAR(20)) 
    '''
)

myCursor.execute(
    '''
        CREATE TABLE COMMAND_MAPPINGS (SIMULATION_ID INTEGER, OBJECT_ID INTEGER, EXECUTION_STR VARCHAR(255),
        REGISTER_FUNCTION VARCHAR(255), SOURCE_PORT VARCHAR(255), DEST_NODE VARCHAR(255), DEST_PORT VARCHAR(255))
    '''
)


myCursor.execute(
    '''
        CREATE TABLE VISUAL_OBJ (ACCOUNT_ID INTEGER, SIMULATION_ID INTEGER, NODE_UID INTEGER UNIQUE , 
        SIM_NODE_ID VARCHAR(255), NODE_TYPE VARCHAR(255), DATA_LABEL VARCHAR(255), NODE_POS_X INTEGER, NODE_POS_Y INTEGER, 
        NODE_HEIGHT INTEGER, NODE_WIDTH INTEGER, NODE_INPUT_TEXT TEXT, NODE_OUTPUT_TEXT TEXT)
    '''
)



#Display of Tables
myCursor.execute("SHOW TABLES")
king = myCursor.fetchall()
print(king)


# METHODS FOR VALIDATING FUNCTION RULE STRINGS


def isFloat(string):
    try:
        float(string)
        return True
    except:
        return False

def isString(string):
    if string[0] == string[-1] == '\"':
        return True
    else:
        return False


def ValidateString(omar_string, availableVars):
    temp_string = omar_string.replace(" ", "")
    omar_list = re.split(r'[*\/+\-]', temp_string)
    print(omar_list)
    isValid = True
    for omar in omar_list:
        # if omar is a digit or declared string
        if not isFloat(omar) and not isString(omar):
            if omar not in availableVars:
                isValid = False
                break

    return isValid











app = Flask(__name__)
CORS(app)

@app.route("/api/SaveVisuals", methods = ["POST"])
def SaveVisual():
    data = request.get_json()
    n_data = [] 
    
    for node_obj in data:
        if node_obj["type"] == "RevNode": 
            n_data.append(node_obj)




    

    for index in range(len(n_data)): 
        node = n_data[index]

        # UNIQUE ID OF NODE IDENTIFICATION
        node_uid = node["UID"]
        print(node_uid)

        # NON DATA NODE INFO
        account_id = 1
        sim_id = 1
        node_id = node["id"]
        node_type = node["type"]
        node_position_x = node["position"]["x"]
        node_position_y = node["position"]["y"]
        node_height = node["height"]
        node_width = node["width"] 
        node_selected =  False 
        node_dragged = False 

        

        # DATA NODE INFO 
        node_data = node["data"]
        node_data_label = node_data["label"]


        node_data_output_str = ""
        node_data_input_str = ""

        for index in range(len(node_data["outputs"])):
            if index == len(node_data) - 1: 
                node_data_output_str = node_data_output_str + node_data["outputs"][index]
            else: 
                node_data_output_str = node_data_output_str + node_data["outputs"][index] +  "|"

        for index in range(len(node_data["inputs"])):
            if index == len(node_data) - 1: 
                node_data_input_str = node_data_input_str + node_data["inputs"][index]
            else: 
                node_data_input_str = node_data_input_str + node_data["inputs"][index] + "|"

        node_data_input_str = node_data_input_str[0:-1]
        node_data_output_str = node_data_output_str[0:-1]

        qry_str = "SELECT * FROM VISUAL_OBJ WHERE NODE_UID = %s" % node_uid
        print("QRY_STR_ERROR: ", qry_str)
        myCursor.execute(qry_str)

        sel_query = myCursor.fetchall()

        if len(sel_query) == 0 :

            qry_str = '''
            INSERT INTO VISUAL_OBJ (ACCOUNT_ID, SIMULATION_ID, NODE_UID, SIM_NODE_ID, NODE_TYPE, DATA_LABEL,  
            NODE_POS_X, NODE_POS_Y, NODE_WIDTH, NODE_HEIGHT, NODE_INPUT_TEXT, NODE_OUTPUT_TEXT) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)''' 
            
            qry_str = qry_str % (account_id, sim_id, node_uid, "'" + node_id + "'",  "'" + node_type + "'", "'" + node_data_label + "'",  node_position_x,  node_position_y, 
           node_width,node_height, "'" + node_data_input_str + "'", "'" + node_data_output_str + "'")

            print(qry_str)

            myCursor.execute(qry_str)
 
            myDB.commit()
        
        else: 

            qry_str = '''UPDATE VISUAL_OBJ SET ACCOUNT_ID = %s, SIMULATION_ID = %s, SIM_NODE_ID = %s, NODE_TYPE = %s, DATA_LABEL = %s,  
            NODE_POS_X = %s, NODE_POS_Y = %s, NODE_WIDTH = %s, NODE_HEIGHT = %s, NODE_INPUT_TEXT = %s, NODE_OUTPUT_TEXT = %s
            WHERE NODE_UID = %s'''
            qry_str = qry_str % (account_id, sim_id, "'" + node_id + "'",  "'" + node_type + "'", "'" + node_data_label + "'",  node_position_x,  node_position_y, 
           node_width,node_height, "'" + node_data_input_str + "'", "'" + node_data_output_str + "'", node_uid)

            myCursor.execute(qry_str)
        
            myDB.commit() 

    return jsonify(data) 


@app.route("/api/GetSimVisuals/SimID=<SimID>", methods=["GET"])
def GetVisualInfo(SimID):
    # Select from the database all the nodes in the system that have the simulation_ID
    myCursor.execute("SELECT * FROM VISUAL_OBJ WHERE SIMULATION_ID = %s", (SimID, ))
    RawData = myCursor.fetchall()
    RawCols = myCursor.description
    NodeList = [] 
    

    columns = []

    for RawCols in myCursor.description:
        columns.append(RawCols[0])

    for row in RawData:
        # Main Node Data container
        NodeJson = {}
        
        # Sub node containers
        DataFile = {}  
        PositionJson = {} 


        row_dict = (dict(zip(columns, row)))
    
        # split inputs and outputs 
        splitStr_input = row_dict["NODE_INPUT_TEXT"].split('|')
        splitStr_output = row_dict["NODE_OUTPUT_TEXT"].split('|')


        DataFile['label'] = row_dict["DATA_LABEL"]

        if splitStr_input == [""]:
            DataFile['inputs'] = []            

        else: 
            DataFile['inputs'] = splitStr_input

        if splitStr_output == [""]: 
            DataFile['outputs'] = [] 
        else: 
            DataFile["outputs"] = splitStr_output
            

        # split the position json
        PositionJson['x'] = row_dict["NODE_POS_X"]
        PositionJson['y'] = row_dict["NODE_POS_Y"]

    

        # form the data 
        NodeJson["id"]  = row_dict["SIM_NODE_ID"]
        NodeJson["UID"] = row_dict["NODE_UID"]
        NodeJson["type"] = row_dict["NODE_TYPE"]
        NodeJson["width"] = row_dict["NODE_WIDTH"]
        NodeJson["height"] = row_dict["NODE_HEIGHT"]
        NodeJson["selected"] = False
        NodeJson['dragging'] = False
        NodeJson["data"] = DataFile
        NodeJson["position"] = PositionJson
        NodeJson["positionAbsolute"] = PositionJson

        NodeList.append(NodeJson)

    return jsonify(NodeList)


# Supplimental Function to extract column names: 
def ExtractColumns(Desc):
    colNames = [] 
    for col in Desc: 
        colNames.append(col[0])
    return colNames




@app.route("/api/GetObject/SimID=<SimID>/ObjectID=<ObjectID>", methods = ["GET"])
def ObjectGetHandler(SimID, ObjectID):

    queryTuple = (SimID, ObjectID)

    # PERFORM THE QUERY LORD HELP ME 
    qStrInput = "SELECT POSID, INPUT_NAME, INPUT_TYPE FROM INPUT_VALUES WHERE SIMULATION_ID = %s AND OBJECT_ID = %s"
    qStrOutput = "SELECT OUTPUT_NAME, OUTPUT_TYPE, OUTPUT_FUNCTION_RULE, COST_REGISTER, COST_FUNCTION FROM OUTPUT_FUNCTIONS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s"
    qStrRegisters = "SELECT REGISTER_NAME, REGISTER_TYPE, REGISTER_INITVAL FROM REGISTERS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s"
    qStrRegisterFunctions = "SELECT  FUNCTION_NAME, REGISTER_FUNCTION_RULE, APPLIES FROM REGISTER_FUNCTIONS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s"
    qStrCommandInputs = "SELECT EXECUTION_STR, REGISTER_FUNCTION, SOURCE_PORT, DEST_NODE, DEST_PORT FROM COMMAND_MAPPINGS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s" 

    commandMaps = []
    inputList = [] 
    outPutList = []
    registerList = []
    regFuncList = [] 
    

    
    myCursor.execute(qStrInput, queryTuple) 
    desc = ExtractColumns(myCursor.description)
    inputList = myCursor.fetchall()
  
    myCursor.execute(qStrOutput, queryTuple)
    desc = ExtractColumns(myCursor.description)
    outPutList = myCursor.fetchall()
    
    myCursor.execute(qStrRegisters, queryTuple)
    desc = ExtractColumns(myCursor.description)
    registerList = myCursor.fetchall()

    myCursor.execute(qStrRegisterFunctions, queryTuple)
    desc = ExtractColumns(myCursor.description)
    regFuncList = myCursor.fetchall()

    myCursor.execute(qStrCommandInputs, queryTuple)
    desc = ExtractColumns(myCursor.description)
    commandMaps = myCursor.fetchall() 


    SelectObjectInfo = {
        "inputList": inputList, 
        "outPutList" : outPutList, 
        "registerList" : registerList, 
        "regFuncList" : regFuncList, 
        "commandMaps" : commandMaps
    }

    return jsonify(SelectObjectInfo)



@app.route("/api/AddObject", methods = ["POST"])
def ObjectAddHandler(): 
    data = request.get_json()
    print(data) 

    # Error Issue
    issueHandle = {
        "issue" : False, 
        "issueMsg" : "SUCCESS", 
        "NewId" : -1
    }

    ObjName = data["ProcessName"]
    simID = data["SimulationID"]
    
    # Perform Initial Validation of internal name
    infoTuple = (simID, ObjName)
    qString = "SELECT * FROM OBJECTS WHERE SIMULATION_ID = %s AND NAME = %s"
    myCursor.execute(qString, infoTuple)
    identicalList = myCursor.fetchall()

    print("IDENT LIST : ", len(identicalList))


    if len(identicalList) != 0: 
        issueHandle["issue"] = True 
        issueHandle["issueMsg"] = "IDENTICAL OBJECT FOUND FAIL"
        return jsonify(issueHandle)
    else: 
        qString = "INSERT INTO OBJECTS (SIMULATION_ID, NAME) VALUES (%s, %s)" 

        infoTuple = (simID, ObjName) 
        myCursor.execute(qString, infoTuple)
        myDB.commit()

        myCursor.execute("SELECT LAST_INSERT_ID()")

        omar = myCursor.fetchall()
        issueHandle["NewId"] = omar[0][0]

        print(omar)
        response = jsonify(issueHandle)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


'''
DEBUGGER MODE, CHANGE THE ISSUE HANDLER FROM False to issue

'''


@app.route("/api/ObjectSchema", methods = ["POST"])
def HandleValidation():
    data = request.get_json() 
    
    # REPLACE WITH MORE INFO EXTRACTED FROM DATATYPE TABLE
    AvailableTypes = ['str', "F", "Bool"]

    ObjectName = data["ObjectName"]
    ObjectID = data["ObjectID"]
    SimID = data["SimulationID"]
    Register = data["Register"]
    RegisterFunction  = data["RegisterFunction"]
    Outputs = data["Outputs"]
    Inputs = data["Inputs"]
    CommandMaps = data["CommandMaps"]

    print("Outer ", Outputs)

    # issue and messages for error validation
    issue = False
    issueMsg = "No Issue"


    TestId = "1"

    
    # BEGIN DATA VALIDATION  (CHECK IF LOGIC IS SOUND)
    in_name_set = set({})
    reg_name_set = set({})
    reg_func_name_set = set({})
    output_name_set = set({})

    # DATA VALIDATION WITH INPUTS
    for input in Inputs: 
        name = input[1]
        type = input[2]

        if type not in AvailableTypes: 
            issueMsg = "INPUT VARIABLE TYPE OF " + type + "NOT FOUND"
            issue = True
        
        in_name_set.add(name)

    if len(Inputs) != len(in_name_set):
        issueMsg = "NON-UNIQUE INPUT NAMES"
        issue = True 

    # DATA VALIDATION WITH REGISTER

    for reg in Register: 
        name = reg[0]
        type = reg[1]

        if type not in AvailableTypes: 
            issueMsg = "REGISTER VARIABLE TYPE OF " + type + "NOT FOUND"
            issue = True
        
        reg_name_set.add(name)
    


    if len(Register) != len(reg_name_set):
        issueMsg = "NON-UNIQUE REGISTER NAMES"
        issue = True


    RegAvailVars = []
    for name in reg_name_set: 
        name = str(name)
        RegAvailVars.append("r." + name)

    for in_name in in_name_set: 
        RegAvailVars.append(in_name)

    # DATA VALIDATION WITH REGISTER FUNCTIONS

    for reg_func in RegisterFunction: 
        name = reg_func[0]
        func_rule = reg_func[1]
        applies = reg_func[2]

        # Name validation not needed: 
        reg_func_name_set.add(name)

        print("REGISTER NAME: ", reg_name_set)
            
            # Applies rule Validation: 
        if applies not in reg_name_set: 
            issueMsg = "REGISTER FUNCTION ASSIGNED TO NON EXISTENT REGISTER " + applies;  
            issue = True
            
            # Validate rule (CONSTRUCT REGISTER LIST AND SYSTEM)

        if not ValidateString(func_rule, RegAvailVars): 
            issueMsg = 'REGISTER FUNCTION RULE ' + func_rule + " INVALID "
            issue = True 

    
    # VALIDATE OUTPUT FUNCTIONS TABLE
    for Output in Outputs: 
        o_name = Output[0]
        o_type = Output[1]
        o_func_rule = Output[2]
        o_register = Output[3]
        o_cost_func_rule = Output[4]

        # part of name validation 
        output_name_set.add(o_name)

        # see if oType is an avalable type
        if o_type not in AvailableTypes: 
            issue = True 
            issueMsg = "INVALID OUTPUT FUNCTION TYPE NAME"

            # Determine if the register name is in the register set: 
        if o_register not in reg_name_set:
            issue = True 
            issueMsg = o_register + " NOT A REGISTER VALUE IN OBJECT " 



        # Asssemble the registerNameList for the validate string
        registerNameList = list(reg_name_set)
        print("OH SHIOT ", str(o_func_rule))    
        o_func_rule = str(o_func_rule)
        if not ValidateString(o_func_rule, registerNameList):
            issueMsg = 'OUTPUT FUNCTION RULE ' + o_func_rule + " INVALID "
            issue = True 

        if not ValidateString(o_cost_func_rule, registerNameList):
            issueMsg = 'OUTPUT COST FUNCTION RULE ' + o_cost_func_rule + " INVALID "
            issue = True 


        # TODO: ADD VALIDATION FOR THE COMMAND INPUT FUNCTIO
    issue = False    

        # MAKE MORE EFFICIENT USING A LOG SYSTEM
    if issue == False:

        SuccStruct = {
            "Issue" : issue, 
            "IssueMsg" : issueMsg 
        }

        delTuple = (SimID, ObjectID)
        # DELETE THE NODE RECORDS FROM THE tables 

        #INPUT 
        myCursor.execute("DELETE FROM INPUT_VALUES WHERE SIMULATION_ID = %s AND OBJECT_ID = %s", delTuple)
        myCursor.execute("DELETE FROM COMMAND_MAPPINGS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s", delTuple)
        myCursor.execute("DELETE FROM OUTPUT_FUNCTIONS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s", delTuple)
        myCursor.execute("DELETE FROM REGISTER_FUNCTIONS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s", delTuple)
        myCursor.execute("DELETE FROM REGISTERS WHERE SIMULATION_ID = %s AND OBJECT_ID = %s", delTuple)
        myDB.commit() 

        # Do for Updates and Outputs
        print("INPUTS",  Inputs)

        for input in Inputs: 
            insertTuple = (SimID, ObjectID, input[0], input[1], input[2])
                
            print("LOOK HERE: ",  insertTuple)
                
            myCursor.execute('''
            INSERT INTO INPUT_VALUES (SIMULATION_ID, OBJECT_ID, POSID, INPUT_NAME, INPUT_TYPE) VALUES 
            (%s, %s, %s, %s, %s)
            ''', insertTuple)

            myDB.commit()

        for output in Outputs: 
            outputTuple = (SimID, ObjectID, output[0], output[1], output[2], output[3], output[4])
                
            myCursor.execute('''
            INSERT INTO OUTPUT_FUNCTIONS (SIMULATION_ID, OBJECT_ID, OUTPUT_NAME, OUTPUT_TYPE, OUTPUT_FUNCTION_RULE,
            COST_REGISTER, COST_FUNCTION) VALUES (%s, %s, %s, %s, %s, %s, %s)
            ''', outputTuple)

            myDB.commit() 

        for reg_func in RegisterFunction:
            regTuple = (SimID, ObjectID, reg_func[0], reg_func[1], reg_func[2])
                
            myCursor.execute('''
            INSERT INTO REGISTER_FUNCTIONS (SIMULATION_ID, OBJECT_ID, FUNCTION_NAME, 
            REGISTER_FUNCTION_RULE, APPLIES) VALUES (%s, %s, %s, %s, %s)
            ''', regTuple)

            myDB.commit() 

        for reg in Register: 
            reg = (SimID, ObjectID, reg[0], reg[1], reg[2])

            myCursor.execute('''
            INSERT INTO REGISTERS (SIMULATION_ID, OBJECT_ID, REGISTER_NAME, REGISTER_TYPE, REGISTER_INITVAL)
            VALUES (%s, %s, %s, %s, %s)
            ''', reg)

            myDB.commit()

 

        for cmd in CommandMaps: 
            cmd_row = (SimID, ObjectID, cmd[0], cmd[1], cmd[2], cmd[3], cmd[4])

            myCursor.execute('''
            INSERT INTO COMMAND_MAPPINGS (SIMULATION_ID, OBJECT_ID, EXECUTION_STR, REGISTER_FUNCTION, SOURCE_PORT, DEST_NODE, DEST_PORT)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ''', cmd_row)

            myDB.commit()

    StatusStruct = {
        "Issue" : False, 
        "IssueMsg" : issueMsg
    }

    return jsonify(StatusStruct)





'''
DEVICE HANDSHAKE CODE AND DEVICE RELATED CODE: 
'''
@app.route("/api/RemoveActiveDevice", methods=["POST"])
def RemoveActiveDevice(): 
    data = request.get_data() 
    target_id = data["Device_ID"]
    delString = 'DELETE FROM ACTIVE_DEVICES WHERE DEVICE_ID = %s'
    delString = delString % (target_id, )
    myCursor.execute(delString)
    return jsonify("Device Removal Successful")




@app.route("/api/AddActiveDevice", methods = ["POST"]) 
def AddActivateDevice():
    data = request.get_data() 
    DEV_ID = data["Device_ID"]
    DEV_IP = data['Device_IP']  
    OWNER_ID = data["OWNER_ID"] 

    istString = 'INSERT INTO ACTIVE_DEVICES (DEVICE_ID, DEVICE_IP, DEVICE_REGISTER_OWNER) VALUES (%s, %s, %s)'
    istString = istString % (DEV_ID, DEV_IP, OWNER_ID)

    myCursor.execute(isString)
    return jsonify("Device Addition Successful")
    


@app.route("/api/GetDeviceTypes", methods=["GET"])
def GetDeviceTypes():
    return jsonify(list(GetDeviceTypeNames())) 


@app.route("/api/GetMethods/DeviceType=<DevType>", methods = ["GET"])
def GetDeviceMeth(DevType):
    DeviceType = DevType
    ResultantString = GetDeviceMethods(DeviceType)
    return jsonify(ResultantString)


# DevMeth contains the Device type and Method SEPERATED BY A ':' so like: "/api/GetParams/DeviceType=LED:FLASH"
@app.route("/api/GetParams/DeviceType=<DevMeth>", methods = ["GET"])
def GetDeviceParams(DevMeth):
    spl_string = DevMeth.split(':')
    DeviceType = spl_string[0]
    DeviceMethod = spl_string[1]
    ResultantString = GetMethodParams(DeviceType, DeviceMethod)

    return jsonify(ResultantString)

# Gets the Custom Method Info stored in the MONGODB database (at the Simulation level)
@app.route("/api/GetMDGMethodInfo/SimID=<SimID>", methods = ["GET"])
def GetMDGInfo_SIM(SimID):
    Sim_Dev_Dict =MDB_Handler.RetrieveProcessDataMenu(sim_id = int(SimID))
    return jsonify(Sim_Dev_Dict) 



@app.route("/api/AddDeviceInfo", methods = ["POST"])
def AddDevInfo():
    return jsonify("This is becomming awful, to be continued")

    



# Search the set of devices. 
@app.route("/api/DeviceHandshake", methods = ["POST"])
def DeviceHanshake():
    data = request.get_json() 

    DeviceJson = {"Success" : True}

    dev_code = data["Device_Code"]
    dev_passwrd = data["Device_Password"]

    if dev_code == "82869832" and dev_passwrd == "Forza007":
        ip = "192.168.86.27"
        if Dev_Handshake(ip) == "Success":
            return "Handshake_Lock"
        else: 
            return "Handshake_Fail"




        

        























        
'''
    LOGIN CODE, PLEASE EDIT 
'''



@app.route("/api/register", methods=["POST"])
def ParseRegistration():
    data = request.get_json()
    print(data)
    usr_email = data["Email"]
    usrname = data["Username"]
    passwrd = data["Password"]
    ConfirmPassword = data["ConfirmPassword"]
    InterestList = data["InterestList"]

    registerStatus = {
        "regStatus" : "Successful" 
    }
    # Perform the following validation tests
    if passwrd != ConfirmPassword:
        registerStatus["regStatus"] = "Passwords_Dont_match"
        return jsonify(registerStatus)

    # Perform query on the database to check if password exists
    qString = "SELECT * FROM Accounts  WHERE Username = '" + usrname + "'"
    myCursor.execute(qString)
    sameList = myCursor.fetchall()
    if len(sameList) != 0:
        registerStatus["regStatus"] = "User_already_exists"
        return jsonify(sameList)


    # Perform query and test for uniqueness with passwords
    qString = "SELECT * FROM Accounts  WHERE Email = '" + usr_email + "'"
    myCursor.execute(qString) 
    sameList = myCursor.fetchall()
    if len(sameList) != 0:
        registerStatus["regStatus"] = "Email_already_exists"
        return jsonify(registerStatus)


    # All pass tests add entry to database
    qString = "INSERT INTO Accounts (Email, Username, Password, CreatorTags, Description) VALUES (%s, %s, %s, %s, %s)"
    tagString = ""
    for item in InterestList:
        print(item)
        tagString += item + ";"

    val = (usr_email, usrname, str(hash(passwrd)), tagString, "Put Description Here")
    myCursor.execute(qString, val)
    return jsonify(registerStatus)
    

@app.route("/api/user=<user>", methods=["GET"])
def GetAccount(user):
    # get the account file in the database
    qString = "SELECT * FROM Accounts WHERE Username = %s"
    userTuple = (user,)
    myCursor.execute(qString, userTuple)
    targetUser = myCursor.fetchall() 
    
    getStatus = {
        "Status" : "Successful"
    }

    if len(targetUser) == 0:
        getStatus["Status"] = "Not Found!"
        return jsonify(getStatus)
    else:
        usr = targetUser[0]
        usrStruct = {
            "Email" : usr[0],
            "Username" : usr[1],
            "Password" : usr[2],
            "CreatorTags" : usr[3],
            "Description" : usr[4],
        }
        return jsonify(usrStruct)



@app.route("/api/getall", methods=["GET"])
def GetAllAccounts():
    # get the account file in the database
    qString = "SELECT * FROM Accounts"
    myCursor.execute(qString)
    targetUser = myCursor.fetchall() 
    usrStructList = []
    
    for usr in targetUser:
        usrStruct = {
            "Email" : usr[0],
            "Username" : usr[1],
            "Password" : usr[2],
            "CreatorTags" : usr[3],
            "Description" : usr[4],
        }

        usrStructList.append(usrStruct)


    return jsonify(usrStructList)
   

@app.route("/api/login", methods = ["POST"])
def ParseLogin(): 
    data = request.get_json()
    username = data["user"]

    

if __name__ == "__main__":
    app.run(debug=True)



