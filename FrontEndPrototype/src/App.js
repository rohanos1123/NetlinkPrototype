import logo from './logo.svg';
import {Route, Routes} from 'react-router-dom'
import './App.css';
import {Buttons, TextBox, DisplayText, VariableMenu, ProcessMenu, RadioSelect} from './Webpages/ComponentList.js'
import {DynamicForm, DeviceMethodContainer, SampleMethod2} from './Webpages/ComponentsList2.js'
import { Component, useCallback, useMemo} from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MarkerType,} from 'reactflow'; 
import {useTable} from "react-table"
import axios from 'axios'
import Register from './Webpages/Registry'
import LoginForm from './Webpages/Login'
import MainForm, { GraphBuilderFunc, DeviceManager, DeviceManagerPOC } from './Webpages/GraphBuilderPage'
import {CountFunc, FlowChart, TabSwitch} from './Webpages/playground'
import 'reactflow/dist/style.css';





function App() {


  return (
    <Routes>
      <Route path="/" element={<div className="title"><h1>NetLink</h1></div>}/>
      <Route path="/login" element={<LoginForm/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/graph" element={<GraphBuilderFunc  SimID = "1"/>}/>
      <Route path="/playground" element={<FlowChart/>}/>
      <Route path="/DeviceManger" element={<DeviceManager/>}/>
    </Routes>
  );
}

export default App;
