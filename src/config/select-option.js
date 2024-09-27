import { useState, useEffect } from "react";
import { Config } from "./connection";
const api = Config.urlApi;
const shop_id_fk = localStorage.getItem('shop_id_fk');
export function useProvince() {
  const [itemProvince, setItemProvince] = useState([]);
  useEffect(() => {
    const showProvince = async () => {
      try {
        const response = await fetch(api + 'province');
        const jsonData = await response.json();
        setItemProvince(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    showProvince();
  }, []);
  const data = itemProvince.map(item => ({ label: item.provinceName, value: item.province_id }));
  return data;
}
export function useBrand() {
  const [itemBrand, setItemBrand] = useState([]);
  useEffect(() => {
    const showBrands = async () => {
      try {
        const response = await fetch(api + 'brand/' + shop_id_fk);
        const jsonData = await response.json();
        setItemBrand(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showBrands();
  }, []);
  const data = itemBrand.map(item => ({ label: item.brand_name, value: item.brand_id }));
  return data;
}


export function useBrandCart(cartID) {
  const [itemBrand, setItemBrand] = useState([]);
  useEffect(() => {
    const showBrandCart = async () => {
      try {
        const response = await fetch(api + 'brand/cates/' + cartID);
        const jsonData = await response.json();
        setItemBrand(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showBrandCart();
  }, [cartID]);
  const data = itemBrand.map(item => ({ label: item.brand_name, value: item.brand_id }));
  return data;
}

export function useCategory() {
  const [itemCategory, setItemCategory] = useState([]);

  useEffect(() => {
    const showCategory = async () => {
      try {
        const response = await fetch(api + 'cates/' + shop_id_fk);
        const jsonData = await response.json();
        setItemCategory(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showCategory();
  }, []);

  const data = itemCategory.map(item => ({ label: item.categories_name, value: item.categories_id }));

  return data;
}


export function useUnite() {
  const [itemUnite, setItemUnite] = useState([]);
  useEffect(() => {
    const showUnite = async () => {
      try {
        const response = await fetch(api + 'unite/' + shop_id_fk);
        const jsonData = await response.json();
        setItemUnite(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showUnite();
  }, []);

  const data = itemUnite.map(item => ({ label: item.unit_name, value: item.units_id }));

  return data;
}


export function useBranch() {
  const [itemBranch, setItemBranch] = useState([]);
  useEffect(() => {
    const showBranch = async () => {
      try {
        const response = await fetch(api + 'branch/' + shop_id_fk);
        const jsonData = await response.json();
        setItemBranch(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showBranch();
  }, []);

  const data = itemBranch.map(item => ({ label: item.branchName, value: item.branchId }));

  return data;
}



export function useRights() {
  const [itemRights, setItemRights] = useState([]);
  useEffect(() => {
    const showRights = async () => {
      try {
        const response = await fetch(api + 'rights/' + shop_id_fk);
        const jsonData = await response.json();
        setItemRights(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showRights();
  }, []);

  const data = itemRights.map(item => ({ label: item.rights_name, value: item.rights_id }));
  return data;
}


export function useStaff() {
  const [itemStaff, setItemStaff] = useState([]);
  useEffect(() => {
    const showStaff = async () => {
      try {
        const response = await fetch(api + 'staff/' + shop_id_fk);
        const jsonData = await response.json();
        setItemStaff(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showStaff();
  }, []);

  const data = itemStaff.map(item => ({ label: item.first_name + ' ' + item.last_name, value: item.staff_id }));

  return data;
}


export function useDepart() {
  const [itemDepart, setItemDepart] = useState([]);
  useEffect(() => {
    const showDepart = async () => {
      try {
        const response = await fetch(api + 'depart/' + shop_id_fk);
        const jsonData = await response.json();
        setItemDepart(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showDepart();
  }, []);

  const data = itemDepart.map(item => ({ label: item.departName, value: item.depart_id }));

  return data;
}



export function useCurrency() {
  const [itemDepart, setItemDepart] = useState([]);
  useEffect(() => {
    const showCurrency = async () => {
      try {
        const response = await fetch(api + 'currency');
        const jsonData = await response.json();
        setItemDepart(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showCurrency();
  }, []);

  const data = itemDepart.map(item => ({ label: item.currency_name, value: item.currency_id }));

  return {data:data,item:itemDepart};
}



export function usePage(data) {

  const limit = [{
    label: 25, value: 25
  },
  {
    label: 50, value: 50
  },
  {
    label: 100, value: 100
  },
  {
    label: 150, value: 150
  },
  {
    label: 200, value: 200
  },
  {
    label: '--ທັງໝົດ--', value: data
  },];

  return limit;
}