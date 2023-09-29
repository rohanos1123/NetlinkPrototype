# This python file contains the sets of methods that directly control the Devices (Does not handle threads)
import RPi.GPIO as GPIO 
import pandas as pd
from GPIOMethods import PORTManager
import threading 
import time 

# Transfer the port array from the 

class GPIOHandler:
    def __init__(self):
        # The Port Manager Dict
        self.PM_Dict = {}

        # Maps the port name to the port number 
        self.PName_map = {} 
        GPIO.setmode(GPIO.BCM)


    # Port of form: [['19', 'LED', 'LED1']]
    def setup_ports(self, port_in):
        for desc in port_in:
            port_num = desc[0]
            port_type = desc[1]
            port_name = desc[2]
            GPIO_type_pd = pd.read_csv("RevisedDeviceManager/ConfFiles/PORT_DEV_MAP.txt", sep=";")
            des_port_type = GPIO_type_pd[GPIO_type_pd["DEVICE_TYPE"] == port_type].iloc[0]["GPIO_MODE"]
            newPort = PORTManager(int(port_num), des_port_type)
            self.PM_Dict.update({port_num : newPort})
            self.PName_map.update({port_name : port_num})


    # [{'DEV_TYPE': 'LED', 'METHOD': 'ACTIVE', 'PARAMS': {'State': 0}, 'PORT': '18'}, {'DEV_TYPE': 'LED', 'METHOD': 'ACTIVE', 'PARAMS': {'State': 0}, 'PORT': '17'}]
    # PORT SETTING WILL BE DONe in the backend of the device (MAY BE SLOW, FIX LATER YOU FUCKING IDIOT)
    def Execute(self, Method_Info): 
        port_map = Method_Info["PORT_MAP"]
        command_list = Method_Info["COMMANDS"]

        # Threading data
        thread_list = []
        sub_threads = []
        dura_list = []        

        # Building of the port map
        self.setup_ports(port_map)

        for cmd in command_list: 
            dev_type = cmd["DEV_TYPE"]
            dev_method = cmd["METHOD"]
            dev_port = cmd["PORT"]
            dev_params = cmd["PARAMS"]

            if dev_type != "GLOBAL": 
                portObj = self.PM_Dict[dev_port]
                new_thread = threading.Thread(target = portObj.PortExec, args = (dev_type, dev_method, dev_params))
                sub_threads.append(new_thread)
            else: 
                 if dev_method == 'THREAD_SEP':
                    thread_list.append(sub_threads)
                    dura_list.append(dev_params["Duration"])
                    sub_threads = []

        # if thread_list is empty (no presence of a thread seperator)
        if thread_list == []: 
            thread_list.append(sub_threads)
            dura_list.append(0)
              

        for i in range(len(thread_list)):
            for thread in thread_list[i]: 
                thread.start()  
            for thread in thread_list[i]: 
                thread.join() 
            time.sleep(dura_list[i])
                     


