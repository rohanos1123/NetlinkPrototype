import re
from FunctionList import FunctionList



def converstionTest(variable, inputSet):
    variableType = "NULL"

    numberString = False
    try:
        float(variable)
        numberString = True
    except:
        numberString = False


    if variable == "True":
        return True, "Bool"
    elif variable == "False":
        return False, "Bool"
    elif (len(variable) >= 2)  and (variable[0] == variable[-1] == "\""):
        return variable[1:-1], "str"
    elif numberString:
        return float(variable), "F"
    else:
        try:
            omar = inputSet[variable]
            val =  omar[0]
            type = omar[1]
            if type == "F":
                val = float(val)
                return (val, "F")
            elif type == "Bool":
                if val == "True":
                    return True, "Bool"
                elif val == "False":
                    return False, "Bool"
                else:
                    print("Variable conversion of " + val + " failure! Reverting to default value!")
                    return False, "Bool"
            else:
                return val, type
        except KeyError:
            raise Exception("Undefined non-string variable in expression evaluation")


# Evaluates primitive subfunctions (functions enclosed within parenthesis)

def evalSubFuncPrim(ruleStr, inputDict):
    Wasabi = FunctionList()

    ruleStr = ruleStr.replace(" ", "")
    pattern = r'(\d+\.\d+|\d+|".*?"|\b[\w.]+\b|(?<=[*/+-])-?\d+\.\d+(?![.\d])|(?<=[*/+-])-?\d+)'
    components = re.split(pattern, ruleStr)
    components = [c.strip() for c in components if c.strip()]

    if len(components) == 1:
        res = converstionTest(components[0], inputDict)
        return ([res[0]], res[1]) 

    changed = False
    operations = [('*', '/'), ('+', '-')]
    for op in operations:
        index = 0
        while index < len(components):
            char = components[index]
            if char in op:
                operation = char
                try:
                    lOperand = components[index-1]
                    rOperand = components[index+1]
                except IndexError:
                    raise Exception("Binary Operator missing left or right Operand")

                lOperand = converstionTest(lOperand, inputDict)
                rOperand = converstionTest(rOperand, inputDict)

                opTuple = (operation, lOperand[1], rOperand[1])


                value = Wasabi.evalOP(opTuple, lOperand[0], rOperand[0])

                if value[1] == "F":
                    value = str(value[0])
                    repType = "F"
                elif value[1] == "str":
                    value = "\"" + value[0] + "\""
                    repType = "str"
                elif value[1] == "Bool":
                    value = str(value[0])
                    repType = "Bool"


                components[index] = value
                components.pop(index + 1)
                components.pop(index-1)
                index = 0
                continue

            index = index + 1

    return components, repType


def evalFuncString(funcString, inputDict):


    if funcString.find("(") == -1 and funcString.find(")") == -1:
        res_tuple = evalSubFuncPrim(funcString, inputDict)
        return res_tuple[0], res_tuple[1] 

    newString = funcString

    while funcString.find("(") != -1 and funcString.find(")") != -1:
        posStack = []
        for index in range(len(funcString)):
            char = funcString[index]
            if funcString[index] == '(':
                posStack.append(index)
            elif funcString[index] == ')':
                startPos = posStack.pop()
                endPos = index
                subFunction = funcString[startPos+1 : endPos]
                value = evalSubFuncPrim(subFunction, inputDict)[0]
                funcString = funcString[0: startPos] + value[0] + funcString[endPos + 1:]
                break

    if not posStack:
        return evalSubFuncPrim(funcString, inputDict)[0]
    else:
        raise Exception("Mismatched parenthesis!")











