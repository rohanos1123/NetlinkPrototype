from flask import Flask, request, jsonify
from flask_cors import CORS
from GPIOHandler import GPIOHandler
import os 
import re 
import random
import subprocess as sp
import requests
import json 


# ADD additional cors scripting security protocol here: 
app = Flask(__name__)
CORS(app)



# Intialization Methods: 

def Get_Init_Device_Info(net_interface):
    # Check and create ID:

    chosen_id = "INITIAL"


    # Get or read random ID:
    if os.path.isfile("RevisedDeviceManager/ConfFiles/idParams.txt"):
        f = open("RevisedDeviceManager/ConfFiles/idParams.txt", 'r')
        lines = f.readlines()
        for line in lines:
            chosen_id = line

    else:
        f = open("RevisedDeviceManager/ConfFiles/idParams.txt", 'w')
        rand_id = random.randint(10000000, 99999999)
        f.write(str(rand_id))
        chosen_id = str(rand_id)

    if net_interface == "":
        cmd_string = "ifconfig"
    else:
        cmd_string = ['ifconfig', net_interface]

    ifconfig_string = sp.check_output(cmd_string, universal_newlines=True)
    # extract IP address from the ifconfig string:
    IP_extract = re.findall(r'inet (.*)(?= netmask)', ifconfig_string)[0]

    DataDict = {"Device_ID" : chosen_id, "IP_Extract" : IP_extract.replace(" ", '')}
    return DataDict


def SendIntialMessage(): 
    # Define the URL of the remote server
    remote_url = 'http://192.168.1.19:5001/AddDeviceDB'  # Replace with the actual IP address and port of the remote server

    # Define the data to send in the request
    datap = Get_Init_Device_Info('wlan0')
    headers_in = {'Content-Type': 'application/json'}
    json_data = json.dumps(datap)


    # Send a POST request to the remote server
    try: 
        response = requests.post(remote_url, data=json_data, headers = headers_in)
        response.raise_for_status() 
        print('Response: ', response.text)
    except requests.exceptions.RequestException as e: 
        print("failure Message: ", e)



# Handshaking Method for the client device
@app.route("/Handshake", methods = ["POST"])
def VERIFY_PASSWORD():
    data = request.get_json()
    print(data)
    pass_attempt = data["pass_attempt"]

    target_password = ""
    if os.path.isfile("RevisedDeviceManager/ConfFiles/Password.txt"):
        f = open("RevisedDeviceManager/ConfFiles/Password.txt", 'r')
        lines = f.readlines()
        for line in lines:
            target_password = line

    else:
        f = open("RevisedDeviceManager/ConfFiles/Password.txt", 'w')
        rand_id = "toor"
        f.write(rand_id)
        target_password = rand_id

    if (target_password == pass_attempt):
        verify_result = {"Results" : "Match"}
    else: 
        verify_result = {"Results" : "Unmatch"}

    return jsonify(verify_result)


# Sample API Request: [{'DEV_TYPE': 'LED', 'METHOD': 'ACTIVE', 'PARAMS': {'State': 0}, 'PORT': '18'}, {'DEV_TYPE': 'LED', 'METHOD': 'ACTIVE', 'PARAMS': {'State': 0}, 'PORT': '17'}]
@app.route("/ExecuteOrder", methods=["POST"])
def EXEC_ORDER():
    data_p = request.get_json() 
    GPIO_Handler = GPIOHandler() 

    try: 
        GPIO_Handler.Execute(data_p)
        json_send = {"Message" : "The Message was successful!"} 
        return jsonify(json_send)
    except: 
        raise ("BOY IF YOU DONT")


if __name__ == '__main__': 
    SendIntialMessage()
    app.run(host='192.168.1.21')



   

