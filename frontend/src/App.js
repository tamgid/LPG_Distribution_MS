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
          <Route path='/' element={<Login userName={userName} setName={setName}/>} />
          <Route path='/home' element={<Home userName={userName} setName={setName}/>}>
            <Route path='/home/userManagement' element={<UserManagement userName={userName} />}></Route>
            <Route path='/home/contacts' element={<Contacts userName={userName} />}></Route>
            <Route path='/home/employee' element={<Employee userName={userName} />}></Route>
            <Route path='/home/addEmployee' element={<AddEmployee userName={userName} />}></Route>
            <Route path='/home/products' element={<Product userName={userName} />}></Route>
            <Route path='/home/addProducts' element={<AddProducts userName={userName}/>}></Route>
            <Route path='/home/accounts' element={<Accounts userName={userName} />}></Route>
            <Route path='/home/contactReports' element={<ContactReports userName={userName} />}></Route>
            <Route path='/home/listPurchases' element={<ListPurchases userName={userName} />}></Route>
            <Route path='/home/addPurchases' element={<AddPurchases userName={userName} />}></Route>
            <Route path='/home/listSales' element={<ListSales userName={userName} />}></Route>
            <Route path='/home/sellsSummary' element={<SellsSummary userName={userName} />}></Route>
            <Route path='/home/addSale' element={<AddSale userName={userName} />}></Route>
            <Route path='/home/expanses' element={<Expanses userName={userName} />}></Route>
            <Route path='/home/income' element={<Income userName={userName} />}></Route>
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
