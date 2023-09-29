import pandas as pd 
import numpy as np 

def GetDeviceMethods(in_DeviceType): 
    DeviceMethods_df = pd.read_csv("/Users/noham/SystemModeler/Backend_Prototype/NetLinkCoreProcess/DeviceCommandDriver.txt", sep=";")
    DevMethods = list(DeviceMethods_df[DeviceMethods_df["DEVICE_TYPE"] == in_DeviceType]["METHOD"])
    return DevMethods

def GetMethodParams(in_DeviceType, in_MethodName): 
    DeviceMethods_df = pd.read_csv("/Users/noham/SystemModeler/Backend_Prototype/NetLinkCoreProcess/DeviceCommandDriver.txt", sep=";")
    ParamString = DeviceMethods_df[(DeviceMethods_df["DEVICE_TYPE"] == in_DeviceType) & (DeviceMethods_df["METHOD"] == in_MethodName)]
    if len(ParamString) != 0: 
        ParamString  = ParamString.iloc[0]["PARAMETERS"]
        ParamList = ParamString.split(":")
    else:
        ParamList = "FAIL"

    return ParamList

def GetDeviceTypeNames():
        Device_pd = pd.read_csv("/Users/noham/SystemModeler/Backend_Prototype/NetLinkCoreProcess/DeviceCommandDriver.txt", sep=";")
        Device_List = Device_pd["DEVICE_TYPE"].unique() 
        return Device_List






