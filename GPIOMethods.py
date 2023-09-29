# Contains the general GPIO Methods
import RPi.GPIO as GPIO
import time 
import threading
import inspect 

class PORTManager:
    def __init__(self, target_port, port_type): 
        self.t_port = target_port
        self.p_type = port_type
        self.read_type = ""

        if(port_type == "OUT"):
            self.read_type = GPIO.OUT
        elif(port_type == "IN"):
            self.read_type = GPIO.HIGH


        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.t_port, self.read_type)

        # Update the method mapper 
        self.MethodMapper = {
            "LED":{
                "ACTIVE_DUR" : self.LED_ACTIVE_DUR, 
                "FLASH" : self.LED_FLASH_DUR,
                "ACTIVE" : self.LED_ACTIVE
            }
        }

    # LET LED BE ACTIVE
    def LED_ACTIVE(self, State):
        if State == "ON":
            GPIO.output(self.t_port, GPIO.HIGH)
        else:
            GPIO.output(self.t_port, GPIO.LOW)

    
    # LED is active for a certain duration 
    def LED_ACTIVE_DUR(self, val, duration):

        
        GPIO_val = ""
        Compat_Type = "LED"
        
        if(val == "True"):
            GPIO_val = GPIO.HIGH
        elif(val == "False"): 
            GPIO_val = GPIO.LOW 

        GPIO.output(self.t_port, GPIO_val)
        time.sleep(duration)
        GPIO.output(self.t_port,GPIO_val)


    # LED will flash for a certain duration 
    def LED_FLASH_DUR(self, Rate, Duration):


        
        cycle_count = int(Duration/Rate)
        for i in range(0, cycle_count): 
            GPIO.output(self.t_port, GPIO.HIGH)
            time.sleep(Rate)
            GPIO.output(self.t_port, GPIO.LOW)
            time.sleep(Rate)

    def PortExec(self, Device_Type, Meth_Name, Parameters ):
        target_method = self.MethodMapper[Device_Type][Meth_Name]
        param_list = inspect.signature(target_method).parameters
        input_list = []
        for param_name in param_list: 
            input_list.append(Parameters[param_name]) 
        args = tuple(input_list)
        self.MethodMapper[Device_Type][Meth_Name](*args)
        

            

    


        
''' 
Sample Demonstration of the threading program: 


king = PORTManager(17, "OUT")
king2 = PORTManager(18, "OUT")
if __name__ == '__main__': 
    thread_light1 = threading.Thread(target=king.LED_FLASH_DUR, args = (0.2, 5))
    thread_light2 = threading.Thread(target=king2.LED_FLASH_DUR, args = (0.05, 5)) 

'''


