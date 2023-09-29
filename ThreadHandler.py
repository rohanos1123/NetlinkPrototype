from GPIOHandler import GPIOHandler 

king = GPIOHandler()

james = {"COMMANDS": [{"DEV_TYPE": "LED", "METHOD": "FLASH", "PARAMS": {"Duration": 5, "Rate": 0.05}, "PORT": "18"}, {"DEV_TYPE": "LED", "METHOD": "FLASH", "PARAMS": {"Duration": 5, "Rate": 0.2}, "PORT": "17"}], "PORT_MAP": [["17", "LED", "Main"], ["18", "LED", "Sub"]]}
king.Execute(james)