from flask import Flask, request
import requests


def Dev_Handshake(ipName): 
    print("Here: ", ipName)
    requestStr = 'http://' + ipName + ':5001/DeviceHandshake'
    response = requests.get(requestStr)
    if response.status_code == 200: 
        return "Success"
    else:
        return "Failure"

def SendToMachine():
    requestStrExecCmd = 'http://192.168.1.21:5000/test'
    dict_map = {"Device_Dict" : {18 : ('OUT', 'LED'), 
    17 : ('OUT', 'LED')}}

    led_active = {"Port" : "18", "Command" : "FLASH", "Parameters" : [0.5, 5]} 

    response = requests.get(requestStrExecCmd, json=led_active)

    if response.status_code == 200:
        print(response)
        print("Nice")
    else:
        print("Shit")

