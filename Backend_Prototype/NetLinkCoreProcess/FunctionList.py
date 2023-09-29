# This class will be  member of the system that will store all predefined and
# user defined functions and operations
# TODO: CLEAR AMBIGUITY IN THE TYPEMAP( '2' : R, and '2' : str would replace eachother)
def EvaluateString(funcString):
    print(funcString)



class FunctionList:
    def __init__(self):
        self.OperatorDict = {
            ('+', "F", "F"): (self.addReal, 'F'),
            ('-', "F", "F"): (self.subtractReal, 'F'),
            ('*', "F", "F"): (self.multReal, 'F'),
            ('/', "F", "F"): (self.divReal, 'F'),
            ('+', "str", "str") : (self.sumString,'str')

        }

        self.functionList = {

        }

    def sumString(self, a, b):
        return a+b

    def addReal(self, a, b):
        return a+b

    def subtractReal(self, a,b):
        return a-b

    def multReal(self, a, b):
        return a*b

    def divReal(self, a, b):
        return a/b

    def evalOP(self, opTuple, op1, op2):
        try:
             return self.OperatorDict[opTuple][0](op1, op2), self.OperatorDict[opTuple][1]
        except KeyError:
            raise Exception("Operation " + opTuple[0] + " undefined between types " + opTuple[1] + " and " + opTuple[2])




func = FunctionList()


def functionCall(functionTuple, typeMap):
    operation = functionTuple[2]
    currTypeMap = typeMap.copy()
    # Read Type Map:
    print(typeMap)

    operand1 = functionTuple[0]
    operand2 = functionTuple[1]

    operatorCall = (operation, typeMap[operand1], typeMap[operand2])

    # Read the typeMap and cast to appropriate Measurement
    if typeMap[operand1] == 'R':
        operand1 = float(operand1)
    if typeMap[operand2] == 'R':
        operand2 = float(operand2)

    retData = func.evalOP(operatorCall, operand1, operand2)
    sol = retData[0]
    solType = retData[1]

    currTypeMap.update({str(sol):solType})

    return str(sol), currTypeMap













