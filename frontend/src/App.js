import './App.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './components/Login';
import Home from './components/Home';
import UserManagement from './components/UserManagement';
import Contacts from './components/Contacts';
import Employee from './components/Employee';
import Product from './components/Product';
import Accounts from './components/Accounts';
import ContactReports from './components/ContactReports';
import StockTransfer from './components/StockTransfer';
import StockAdjustment from './components/StockAdjustment';
import Exchanges from './components/Exchanges';
import CylinderTrack from './components/CylinderTrack';
import Expanses from './components/Expanses';
import Income from './components/Income';
import Profile from './components/Profile';
import About from './components/About';
import ContactUs from './components/ContactUs';
import Register from './components/Register';
import AddEmployee from './components/AddEmployee';
import {useState } from 'react';
import axios from 'axios';
import AddProducts from './components/AddProducts';
import AddPurchases from './components/AddPurchases';
import ListPurchases from './components/ListPurchases';
import ListSales from './components/ListSales';
import SellsSummary from './components/SellsSummary';
import AddSale from './components/AddSale';



function App() {

  const [userName, setUserName] = useState('')

  const setName = (name) => {
    setUserName(name)
  }
  axios.defaults.withCredentials = true
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/home' element={<Home userName={userName} setName={setName}/>}>
            <Route path='/home/userManagement' element={<UserManagement />}></Route>
            <Route path='/home/contacts' element={<Contacts />}></Route>
            <Route path='/home/employee' element={<Employee />}></Route>
            <Route path='/home/addEmployee' element={<AddEmployee />}></Route>
            <Route path='/home/products' element={<Product />}></Route>
            <Route path='/home/addProducts' element={<AddProducts />}></Route>
            <Route path='/home/accounts' element={<Accounts />}></Route>
            <Route path='/home/contactReports' element={<ContactReports />}></Route>
            <Route path='/home/listPurchases' element={<ListPurchases />}></Route>
            <Route path='/home/addPurchases' element={<AddPurchases />}></Route>
            <Route path='/home/listSales' element={<ListSales />}></Route>
            <Route path='/home/sellsSummary' element={<SellsSummary />}></Route>
            <Route path='/home/addSale' element={<AddSale />}></Route>
            <Route path='/home/stockTransfer' element={<StockTransfer />}></Route>
            <Route path='/home/stockAdjustment' element={<StockAdjustment />}></Route>
            <Route path='/home/exchange' element={<Exchanges />}></Route>
            <Route path='/home/cylinder' element={<CylinderTrack />}></Route>
            <Route path='/home/expanses' element={<Expanses />}></Route>
            <Route path='/home/income' element={<Income />}></Route>
          </Route>
          <Route path='/profile' element={<Profile userName={userName}/>} />
          <Route path='/about' element={<About userName={userName}/>} />
          <Route path='/contactUs' element={<ContactUs userName={userName}/>} />
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
