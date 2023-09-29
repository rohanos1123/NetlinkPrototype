from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import mysql.connector
import json 
import requests



app = Flask(__name__)

CORS(app)

# Define a route for the root URL
# 10.138.143.122

mySys= mysql.connector.connect(
  host="127.0.0.1",
  user="root",
  password="Raor11232002!", 
)


myDB = mysql.connector.connect(
    host = "127.0.0.1",
    user="root",
    password = "Raor11232002!",
    database="ChronetexDB"
)


mySyscursor = mySys.cursor()
myCursor = myDB.cursor(buffered=True)


myCursor.execute("DROP TABLE ACTIVE_DEVICES")
myCursor.execute("CREATE TABLE ACTIVE_DEVICES (DEVICE_ID CHAR(8), IP_ADDRESS CHAR(15), SIM_ID INTEGER)")


def ExtractIPServer():
    thing = ['ipconfig', 'getifaddr' , 'en0']
    extract_ip =  str(subprocess.check_output(thing))
    return extract_ip[2 : len(extract_ip)-3].replace(" ", '')

@app.route('/AddDeviceDB', methods=['POST'])
def AddDeviceDB():
    data = request.get_json()
    Dev_ID = data["Device_ID"]
    Dev_IP = data["IP_Extract"]
    isrt_str = "INSERT INTO ACTIVE_DEVICES (DEVICE_ID, IP_ADDRESS, SIM_ID) VALUES (%s, %s, %s)"
    isrt_str = isrt_str % ("'" + Dev_ID + "'", "'" + Dev_IP + "'", 0)
    print(isrt_str)
    myCursor.execute(isrt_str)
    myDB.commit()



    king = {"Status" : "Success"}
    return jsonify(king)

@app.route('/ValidSearch', methods=["POST"])
def ValidSearch():
    data = request.get_json() 

    Device_ID = data["DEVICE_ID"]
    Password_Attempt = data["DEVICE_PASSWORD"]
    qry_str = "SELECT IP_ADDRESS FROM ACTIVE_DEVICES WHERE ACTIVE_DEVICES.DEVICE_ID = %s"
    qry_str = qry_str % ("'" + Device_ID + "'", )
    

    myCursor.execute(qry_str)
    Device_IP_list = myCursor.fetchall()
    
    if Device_IP_list: 
        # send the validation request to the Backend_Device
        Device_IP = Device_IP_list[0][0]
        remote_url = 'http://' + Device_IP + ":5000/Handshake"
        pass_attempt_json = {"pass_attempt" : Password_Attempt}
        headers_in = {'Content-Type': 'application/json'}
        json_data = json.dumps(pass_attempt_json)

        try: 
            response = requests.post(remote_url, data=json_data, headers = headers_in)
            response.raise_for_status() 
            if response.json()["Results"] == "Match":
                return jsonify({"ConStatus" : "Connection Success", "PassStatus" : "Match"})
            elif response.json()["Results"] == "Unmatch":
                return jsonify({"ConStatus" : "Connection Success", "PassStatus" : "Unmatch"})

        except requests.exceptions.RequestException as e: 
            print("Failure message: ", e)
            return jsonify({"ConStatus" : "Connection Failure", "PassStatus" : "Failure"})


        
    
    else: 
         return jsonify({"Status" : "Failure"})

    

if __name__ == '__main__':
    server_ip  = ExtractIPServer()
    app.run(host = server_ip, debug=True, port=5001)
