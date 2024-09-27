import React from 'react';
import HomePage from '../screens/Home/HomePage';
import LoingPage from '../screens/Login/Loing';
import BranchPage from '../screens/setting/branchPage';
import TablesPage from '../screens/setting/tablesPage';
import StaffPages from '../screens/setting/staffPages';
import Unitse from '../screens/Product/Unitse';
import CateGories from '../screens/Product/Categories';
import BrandPage from '../screens/Product/Brand-page';
import VendorsPages from '../screens/setting/VendorsPages';
import FormSale from '../screens/Sales/FormSale';
import SettingSystem from '../screens/setting/setting-system';
import DepartMent from '../screens/setting/departMent';
import ShiftSales from '../screens/setting/shift-Sales';
import RightsPage from '../screens/setting/rightsPage';
import RegitsPorducts from '../screens/Product/regitsPorducts';
import TableSale from '../screens/Sales/TableSale';
import StockProducts from '../screens/Product/Stock-products';
import AddToStock from '../screens/Product/Add-ToStock';
import ImportedProducts from '../screens/Product/Imported-products';
import { Routes, Route,Navigate } from "react-router-dom";
export default function AppContent() {
  return (
    <Routes>
        <Route path='/' element={<Navigate replace to={'home'} />} />
            <Route path="/login" element={<LoingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/branch" element={<BranchPage />} />
            <Route path="/table" element={<TablesPage />} />
            <Route path="/staff" element={<StaffPages />} />
            <Route path="/units" element={<Unitse />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/category" element={<CateGories />} />
            <Route path="/vendor" element={<VendorsPages />} />
            <Route path="/sale" element={<TableSale />} />
            <Route path="/open" element={<FormSale />} />
            <Route path='/system' element={<SettingSystem/>}/>
            <Route path='/depart' element={<DepartMent/>}/>
            <Route path='/shift' element={<ShiftSales/>}/>
            <Route path='/rights' element={<RightsPage/>}/>
            <Route path='/rigitpos' element={<RegitsPorducts/>}/>
            <Route path='/stock' element={<StockProducts/>}/>
            <Route path='/add-stock' element={<AddToStock/>}/>
            <Route path='/imported' element={<ImportedProducts/>} />
            </Routes>
  )
}
